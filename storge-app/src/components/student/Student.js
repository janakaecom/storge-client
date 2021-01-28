import React, { useState, useEffect, useRef } from "react";
import XLSX from 'xlsx';
import Button from 'devextreme-react/button';
import fileSaver from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';

import * as Yup from 'yup';

import { Modal } from 'react-bootstrap'
import DataGrid, {
    Editing, Lookup,
    Column, Paging,
    SearchPanel,
    ColumnChooser,
    GroupPanel,
    Export,
    LoadPanel,
    Selection,
    FilterRow,
    RequiredRule,
    EmailRule
} from 'devextreme-react/data-grid';
import { service } from "../helpers/Service";

let selectedFile;
toast.configure();
const initialHeaderValues={
    instituteId:'',
    category1Id:'',
    category2Id:'',
    category3Id:'',
}

const initialValues = {
    Id: '',
    IndexNo: '',
    FirstName: '',
    LastName: '',
    FullName: '',
    PermanentAddress: '',
    ResidenceAddress: '',
    Class: '',
    CallingName: '',
    Email: '',
    Telephone: '',
    ParentCategory1: '',
    ParentCategory1ContactNo: '',
    ParentCategory2: '',
    ParentCategory2ContactNo: '',
    ParentCategory3: '',
    ParentCategory3ContactNo: ''
}
export default function Student() {
    const inputEl = useRef(null);
    const [students, setStudents] = useState([]);
    const [student, setStudent] = useState(initialValues);

    const [categories1, setCategories1] = useState([]);
    const [categories2, setCategories2] = useState([]);
    const [categories3, setCategories3] = useState([]);
    const [institutes, setInstitutes] = useState([]);

    const [headerValues, setInitialHeaderValues] = useState(initialHeaderValues);

    const [category3Txt, setCategory3Txt] = useState('');

    const [categoryErrors, setCategoryErrors] = useState({});




    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
        getCategories();
        getInstitutes();
    }, []);

    const doUpload = (event) => {
        selectedFile = event.target.files[0];
    }


    let data = [{
        "name": "jayanth",
        "data": "scd",
        "abc": "sdef"
    }]

    const downloadTxtFile = () => {
        const downloadUrl = 'http://testsorageweb.somee.com/Myfile/student_list_temp.xlsx';
        // const downloadUrl = 'https://localhost:44369/Myfile/student_list_temp.xlsx';
        fileSaver.saveAs(downloadUrl, 'student_list_template');

    }
    const convertExcelToData = () => {
        if (validateCategory()) {
            doConvertExcelToData();
        }
    }

    const validateCategory = () => {
        debugger
        let temp = {};
        let valid = true;
        if (headerValues.instituteId == '') {
            temp.institute = 'Institute must be selected.'
            valid = false;
        }
        if (headerValues.category1Id == '') {
            temp.category1 = 'Category 1 must be selected.'
            valid = false;
        }
        if (headerValues.category2Id  == '') {
            temp.category2 = 'Category 2 must be selected.';
            valid = false;

        }
        if (headerValues.category3Id  == '') {
            temp.category3 = 'Category 3 must be selected.';
            valid = false;

        }
        setCategoryErrors({
            ...temp
        })
        return valid;

    }
    const showCategoryValidateMsg = (field) => {
        if (categoryErrors[field]) {
            return <small className="form-text text-muted">{categoryErrors[field]}</small>
        }
    }
    const doConvertExcelToData = () => {
        XLSX.utils.json_to_sheet(data, 'out.xlsx');
        if (selectedFile) {
            let fileReader = new FileReader();
            fileReader.readAsBinaryString(selectedFile);
            fileReader.onload = (event) => {
                let data = event.target.result;
                let workbook = XLSX.read(data, { type: "binary" });
                console.log(workbook);
                workbook.SheetNames.forEach(sheet => {
                    setStudents([]);
                    let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                    var students = convertToOriginalObj(rowObject);
                    var duplicateIndexes = findDuplicates(students.map(x => x.IndexNo));
                    if (duplicateIndexes.length > 0) {
                        toast.warning('Index no can not be duplicated - ' +duplicateIndexes.join(','));
                        return
                    }
                    else {
                        setStudents(students);
                    }
                });
            }
        }
        inputEl.current.value = '';
    }
    const getStudentByCategories = (category1, category2, category3) => {
        // if (defaultStudentsList.length > 0) {
        //     var students = defaultStudentsList;

        //     if (category1 != '') {
        //         students = defaultStudentsList.filter(x => x.ParentCategory1 == category1);

        //     }
        //     if (category2 != '') {
        //         students = defaultStudentsList.filter(x => x.ParentCategory2 == category2);
        //     }
        //     if (category3 != '') {
        //         students = defaultStudentsList.filter(x => x.ParentCategory1 == category3);
        //     }

        // }
        // setStudents(students);
    }
    const convertToOriginalObj = (data) => {
        var studentArray = [];
        for (let i = 0; i < data.length; i++) {
            var obj = {};
            obj.Id = i;
            obj.IndexNo = data[i]['Index No'];
            obj.FirstName = data[i]['First Name'];
            obj.LastName = data[i]['Last Name'];
            obj.FullName = data[i]['Full Name'];
            obj.PermanentAddress = data[i]['Permanent Address'];
            obj.ResidenceAddress = data[i]['Residence Address'];
            obj.Class = category3Txt;
            obj.CallingName = data[i]['Calling Name'];
            obj.Email = data[i]['Email'];
            obj.Telephone = data[i]['Telephone'];
            obj.ParentCategory1 = data[i]['Parent Category 1'];
            obj.ParentCategory1ContactNo = data[i]['Parent Category 1 Contact No'];
            obj.ParentCategory2 = data[i]['Parent Category 2'];
            obj.ParentCategory2ContactNo = data[i]['Parent Category 2 Contact No'];
            obj.ParentCategory3 = data[i]['Parent Category 3'];
            obj.ParentCategory3ContactNo = data[i]['Parent Category 3 Contact No'];
            studentArray.push(obj);
        }
        return studentArray;

    }
    const createGardianList = (data) => {
        var gardianArray = [];
        var obj = {};
        obj.GardianTypeId = data['ParentCategory1']
        obj.MobileNo = data['ParentCategory1ContactNo']
        gardianArray.push(obj);
        var obj1 = {};
        obj1.GardianTypeId = data['ParentCategory2']
        obj1.MobileNo = data['ParentCategory2ContactNo']
        gardianArray.push(obj1);
        var obj2 = {};
        obj2.GardianTypeId = data['ParentCategory3']
        obj2.MobileNo = data['ParentCategory3ContactNo']
        gardianArray.push(obj2);
        return gardianArray;

    }
    const getInstitutes = () => {
        service.sendGetRequest({ townId: 1 }, 'Institute/LoadInstitutes')
            .then((response) => { getInstitutesSuccess(response) })
            .catch((error) => { studentSaveFailure(error.response) });
    }
    const getInstitutesSuccess = (result) => {
        if (result) {
            setInstitutes(result.data.town);
        }
    }
    const getCategories = () => {
        service.sendGetRequest({ institueId: 1 }, 'Category/LoadCategory1')
            .then((response) => { getCategory1Success(response) })
            .catch((error) => { studentSaveFailure(error.response) });
    }
    const getCategory1Success = (result) => {
        if (result) {
            setCategories1(result.data.category1);
        }
    }

    const handleOnChange = (ev) => {
        const { value ,name} = ev.target;
        const fieldValue = { [name]: value }

        setInitialHeaderValues({
            ...headerValues,
            ...fieldValue
        })
        
        if (name=="category1Id" && value != '' ) {
            getCategories2(value);

        }
        if (name=="category2Id" && value != '' ) {
            getCategories3(value);

        }
        if(name=="category3Id" && value != '' )
        {
            let index = ev.nativeEvent.target.selectedIndex;
           setCategory3Txt(ev.nativeEvent.target[index].text);
        }
        // else {
        //     setCategories2([]);
        //     setCategory2('');
        //     setCategory3('');
        //     setCategories3([]);
        // }

    }
    const getCategories2 = (category1Id) => {
        service.sendGetRequest({ category1Id: category1Id }, 'Category/LoadCategory2')
            .then((response) => { getCategory2Success(response) })
            .catch((error) => { studentSaveFailure(error.response) });
    }
    const getCategory2Success = (result) => {
        if (result) {
            setCategories2(result.data.category2);
        }
    }
   
    const getCategories3 = (category2Id) => {
        service.sendGetRequest({ category2Id: category2Id }, 'Category/LoadCategory3')
            .then((response) => { getCategories3Success(response) })
            .catch((error) => { studentSaveFailure(error.response) });
    }

    const getCategories3Success = (result) => {
        debugger
        if (result) {
            setCategories3(result.data.category3);
        }
    }
    const handleSubmit = e => {
        e.preventDefault();
        var studentObj = creatObject();
        if (studentObj != null && studentObj.length>0) {
            service.sendPostRequest(studentObj, 'Student')
                .then((response) => { studentSaveSuccess(response) })
                .catch((error) => { studentSaveFailure(error.response) });
        }

    }
    const studentSaveSuccess = (result) => {
        if (result) {
            toast.success("Record Saved Successfully");
            setStudents([]);
        }
    }
    const creatObject = () => {
        var studentArray = [];
        for (let i = 0; i < students.length; i++) {
            var isValid = validation(students[i]);
            if (isValid) {
                var obj = {};
                obj.Id = i;
                obj.IndexNo = students[i]['IndexNo'];
                obj.FirstName = students[i]['FirstName'];
                obj.LastName = students[i]['LastName'];
                obj.InstituteId=Number(headerValues.instituteId);
                obj.FullName = students[i]['FullName'];
                obj.PermanentAddress = students[i]['PermanentAddress'];
                obj.ResidentialAddress = students[i]['ResidenceAddress'];
                obj.Class = students[i]['Class'];
                obj.EnrolledClassId = Number(headerValues.category3Id);
                obj.DisplayName = students[i]['CallingName'];
                obj.Email = students[i]['Email'];
                obj.Telephone = students[i]['Telephone'];
                obj.Gardians = createGardianList(students[i]);
                studentArray.push(obj)
            }
            else {
                return null
            }

        }
        return studentArray;
    }

    const findDuplicates = (arr) => {
        let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
        let results = [];
        for (let i = 0; i < sorted_arr.length - 1; i++) {
            if (sorted_arr[i + 1] == sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }
        return results;
    }
    const validation = (data) => {
        if (data.IndexNo == undefined) {
            toast.warn("Index No is required");
            return false
        }
        if (data.FirstName == undefined) {
            toast.warn("First of index " + data.IndexNo + "  Name is required");
            return false

        }
        if (data.LastName == undefined) {
            toast.warn("Last Name of index " + data.IndexNo + "  is required");
            return false

        }
        if (data.FullName == undefined) {
            toast.warn("Full Name of index " + data.IndexNo + "  is required");
            return false
        }
        if (data.PermanentAddress == undefined) {
            toast.warn("Permanent Address of index " + data.IndexNo + "  is required");
            return false
        }
        if (data.Class == undefined) {
            toast.warn("Class of index " + data.IndexNo + "  is required");
            return false
        }
        if (data.Email == undefined) {
            toast.warn("Email of index " + data.IndexNo + "  is required");
            return false
        }
        if (data.Telephone == undefined) {
            toast.warn("Telephone of index " + data.IndexNo + "  is required");
            return false
        }
        if (data.ParentCategory1 == undefined) {
            toast.warn("Parent Category 1 of index " + data.IndexNo + "  is required");
            return;
        }
        if (data.ParentCategory1ContactNo == undefined) {
            toast.warn("Parent Category1 Contact No  of index " + data.IndexNo + "  is required");
            return false
        }
        return true;
    }
    const studentSaveFailure = (error) => {
        if (error) {
            toast.warning(error.data.Message)
        }
    }

    const onSubmit = values => {
        debugger
        var index = students.findIndex(x => x.Id == values.Id); //update item that saved in db

        if (index > -1) {
            let newStudents = [...students];  //get old values to another list
            newStudents[index] = values;
            setStudents(newStudents)
            setShow(false);
        }
        else {
            setStudents([...students, values]);
            setShow(false);

        }

    }
    const validationSchema = Yup.object().shape({
        IndexNo: Yup.string().trim()
            .required('Index no  is required.'),
        FirstName: Yup.string().trim()
            .required('First Name is required.'),
        LastName: Yup.string().trim()
            .required('Last Name is required.'),
        FullName: Yup.string().trim()
            .required('Full Name is required.'),
        PermanentAddress: Yup.string().trim()
            .required('Permanent Address  is required.'),
        Email: Yup.string().trim()
            .required('Email is required.').
            email('Email is invalid'),
        Class: Yup.string().trim()
            .required('Class is required.'),
        CallingName: Yup.string().trim()
            .required('Calling Name is required.'),
        Telephone: Yup.string().trim()
            .required('Telephone is required.')
            .test('alphabets', 'Contact number is invalid', (value) => {
                if (value == undefined) return true;
                return value = !undefined && /^\d{3}-?\d{3}-?\d{4}$/.test(value);
            }),
        ParentCategory1: Yup.string().trim()
            .required('Parent Category 1 is required.'),
        ParentCategory1ContactNo: Yup.string().trim()
            .required('Parent Category 1 ContactNo  is required.'),

    });


    const onToolbarPreparing = (e) => {
        e.toolbarOptions.items.unshift(
            {
                location: 'after',
                widget: 'dxButton',
                options: {
                    icon: 'plus',
                    text: "Add New",
                    type: "success",
                    onClick: addClick.bind(this)
                }
            });

    }
    const addClick = () => {
        debugger
        setShow(true);
        initialValues.Class=category3Txt;
        setStudent({...initialValues});
    }
    const cellRender = (data) => {
        return <div>
            <a onClick={() => update(data.key)} style={{ 'color': 'blue' }}><u>{data.key.IndexNo}</u></a></div>
    }
    const update = (data) => {
        setShow(true);
        setStudent(data);
    }
    return (
        <>

            <Modal show={show} onHide={handleClose} animation={true} size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Student</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik initialValues={student}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit} >
                        {({ errors, status, touched, handleChange, values, setFieldValue, setFieldTouched, isSubmitting, resetForm }) => (
                            <Form>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputEmail4">Index No</label>
                                        <Field name="IndexNo" className="form-control" maxLength="50" />
                                        <ErrorMessage name="IndexNo" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputEmail4">First Name</label>
                                        <Field name="FirstName" className="form-control" maxLength="50" />
                                        <ErrorMessage name="FirstName" component="div" className="invalid-feedback d-block" />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputPassword4">Last Name</label>
                                        <Field name="LastName" className="form-control" maxLength="50" />
                                        <ErrorMessage name="LastName" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputAddress">Full Name</label>
                                    <Field name="FullName" className="form-control" />
                                    <ErrorMessage name="FullName" component="div" className="invalid-feedback d-block" />
                                </div>
                                <div class="form-group">
                                    <label for="inputAddress2">Permanent Address</label>
                                    <Field name="PermanentAddress" className="form-control" as="textarea" />
                                    <ErrorMessage name="PermanentAddress" component="div" className="invalid-feedback d-block" />
                                </div>
                                <div class="form-group">
                                    <label for="inputAddress2">Residence Address</label>
                                    <Field name="ResidenceAddress" className="form-control" as="textarea" />
                                    <ErrorMessage name=">ResidenceAddress" component="div" className="invalid-feedback d-block" />
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Class</label>
                                        <Field name="Class" className="form-control" disabled/>
                                        <ErrorMessage name="Class" component="div" className="invalid-feedback d-block"  />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Calling Name</label>
                                        <Field name="CallingName" className="form-control" maxLength="150" />
                                        <ErrorMessage name="CallingName" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Telephone</label>
                                        <Field name="Telephone" className="form-control" maxLength="50" />
                                        <ErrorMessage name="Telephone" component="div" className="invalid-feedback d-block" />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Email</label>
                                        <Field name="Email" className="form-control" maxLength="150" />
                                        <ErrorMessage name="Email" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Parent Category 1</label>
                                        <Field name="ParentCategory1" className="form-control" />
                                        <ErrorMessage name="ParentCategory1" component="div" className="invalid-feedback d-block" />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Parent Category1 Contact No</label>
                                        <Field name="ParentCategory1ContactNo" className="form-control" />
                                        <ErrorMessage name="ParentCategory1ContactNo" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Parent Category 2</label>
                                        <Field name="ParentCategory2" className="form-control" />
                                        <ErrorMessage name="ParentCategory2" component="div" className="invalid-feedback d-block" />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress"> Parent Category 2 Contact No</label>
                                        <Field name="ParentCategory2ContactNo" className="form-control" />
                                        <ErrorMessage name="ParentCategory2ContactNo" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Parent Category 3</label>
                                        <Field name="ParentCategory3" className="form-control" />
                                        <ErrorMessage name="ParentCategory3" component="div" className="invalid-feedback d-block" />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress"> Parent Category 3 Contact No</label>
                                        <Field name="ParentCategory3ContactNo" className="form-control" />
                                        <ErrorMessage name="ParentCategory3ContactNo" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary">Save</button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
            <div className="container">
                <br />
                <div class="col-md-12">

                    <div class="form-row">
                        <div class="form-group col-md-3">
                            <label for="inputEmail4">Institute</label>
                            <select className="form-control" name="instituteId" onChange={handleOnChange}>
                            <option value=''>Select</option>
                            {institutes.map((v) => (
                                <option value={v.InstituteId}  >{v.InsName}</option>// value coming from prop
                            ))}
                        </select>
                        {showCategoryValidateMsg('institute')}
                        </div>

                        <div class="form-group col-md-3">
                            <label for="inputEmail4">Category 1</label>
                            <select className="form-control" onChange={handleOnChange} name="category1Id">
                            <option value=''>Select</option>
                            {categories1.map((v) => (
                                <option value={v.Category1id}  >{v.Category1Name}</option>// value coming from prop
                            ))}
                        </select>
                        {showCategoryValidateMsg('category1')}
                        </div>
                        <div class="form-group col-md-3">
                            <label for="inputPassword4">Category 2</label>
                            <select className="form-control" onChange={handleOnChange} name="category2Id">
                            <option value=''>Select</option>
                            {categories2.map((v) => (
                                <option value={v.Category2id}  >{v.Category2Name}</option>// value coming from prop
                            ))}
                        </select>
                        {showCategoryValidateMsg('category2')}
                        </div>
                        <div class="form-group col-md-3">
                            <label for="inputPassword4">Category 3</label>
                            <select className="form-control" onChange={handleOnChange} name="category3Id">
                            <option value=''>Select</option>
                            {categories3.map((v) => (
                                <option value={v.Category3id}  >{v.Category3Name}</option>// value coming from prop
                            ))}
                        </select>
                        {showCategoryValidateMsg('category3')}
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group col-md-3">
                            <button class="btn btn-primary" onClick={downloadTxtFile}>Download Template</button>

                        </div>

                        <div class="form-group col-md-3">
                            <input type="file" id="input" accept=".xls,.xlsx" onChange={doUpload} ref={inputEl} />

                        </div>
                        <div class="form-group col-md-3">
                            <button class="btn btn-primary" id="button" onClick={convertExcelToData}>Upload</button>

                        </div>
                        
                    </div>
                </div>
                <DataGrid
                    dataSource={students}
                    columnAutoWidth={true}
                    onToolbarPreparing={onToolbarPreparing}
                    allowColumnReordering={true}
                    showBorders={true}
                    allowColumnResizing={true}
                    columnAutoWidth={true}
                >

                    <Paging enabled={true} />
                    <Export enabled={true} fileName="student_list" />
                    <GroupPanel visible={true} />
                    <Selection mode="single" />
                    <ColumnChooser enabled={true} />
                    <SearchPanel visible={true} />
                    <FilterRow visible={true} />
                    <Paging defaultPageSize={10} />
                    <LoadPanel enabled={true} />
                    <Editing
                        allowDeleting={true}
                        useIcons={true}
                    />
                    <Column dataField="IndexNo" cellRender={cellRender}><RequiredRule /></Column>
                    <Column dataField="FirstName"><RequiredRule /></Column>
                    <Column dataField="LastName" ><RequiredRule /></Column>
                    <Column dataField="FullName" ><RequiredRule /></Column>
                    <Column dataField="PermanentAddress" ><RequiredRule /></Column>
                    <Column dataField="ResidenceAddress" />
                    <Column dataField="Class" ><RequiredRule /></Column>
                    <Column dataField="CallingName"><RequiredRule /></Column>
                    <Column dataField="Email" ><EmailRule /></Column>
                    <Column dataField="Telephone" />
                    <Column dataField="ParentCategory1" ><RequiredRule /></Column>
                    <Column dataField="ParentCategory1ContactNo"><RequiredRule /></Column>
                    <Column dataField="ParentCategory2" />
                    <Column dataField="ParentCategory2ContactNo" />
                    <Column dataField="ParentCategory3" />
                    <Column dataField="ParentCategory3ContactNo" />

                </DataGrid>
                <br />
                <div class="row">
                    <button class="btn btn-primary" onClick={handleSubmit}>Process</button>
                </div>
            </div>

        </>
    )


}
