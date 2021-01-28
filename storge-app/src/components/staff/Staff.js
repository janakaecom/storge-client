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


const initialValues = {
    Id: '',
    Title: '',
    FirstName: '',
    LastName: '',
    Gender: '',
    Address: '',
    Email: 'd@gmail.com',
    Mobile: '0715701413',
    NextOfKinContact: '',
    RefNo: '',
    Category: '',
    Role: '',
    Active: '',

}
export default function Staff() {
    const inputEl = useRef(null);
    const [staffs, setStaffs] = useState([]);
    const [staff, setStaff] = useState(initialValues);
    const [institutes, setInstitutes] = useState([]);
    const [institute, setInstitute] = useState([]);

    const [instituteError, setInstituteErrors] = useState({});


    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    useEffect(() => {
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
        // const downloadUrl = 'http://testsorageweb.somee.com/Myfile/staff_template.xlsx';
        const downloadUrl = 'https://localhost:44369/Myfile/staff_template.xlsx';
        fileSaver.saveAs(downloadUrl, 'staff_template');

    }
    const convertExcelToData = () => {
        if (validateCategory()) {
            doConvertExcelToData();
        }
    }

    const validateCategory = () => {
        let temp = {};
        let valid = true;
        if (institute == '') {
            temp.institute = 'Institute must be selected.'
            valid = false;
        }
        setInstituteErrors({
            ...temp
        })
        return valid;

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
    const doConvertExcelToData = () => {
        debugger
        XLSX.utils.json_to_sheet(data, 'out.xlsx');
        if (selectedFile) {
            let fileReader = new FileReader();
            fileReader.readAsBinaryString(selectedFile);
            fileReader.onload = (event) => {
                let data = event.target.result;
                let workbook = XLSX.read(data, { type: "binary" });
                console.log(workbook);
                workbook.SheetNames.forEach(sheet => {
                    setStaffs([]);
                    let rowObject = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheet]);
                    var staffs = convertToOriginalObj(rowObject);
                    var duplicateIndexes = findDuplicates(staffs.map(x => x.RefNo));
                    if (duplicateIndexes.length > 0) {
                        toast.warning('Ref No no can not be duplicated - ' + duplicateIndexes.join(','));
                        return
                    }
                    else {
                        setStaffs(staffs);
                    }
                });
            }
        }
        inputEl.current.value = '';
    }

    const convertToOriginalObj = (data) => {
        var teacherArray = [];
        for (let i = 0; i < data.length; i++) {
            var obj = {};
            obj.Id = i;
            obj.RefNo = data[i]['Ref No'];
            obj.Title = data[i]['Title'];
            obj.FirstName = data[i]['First Name'];
            obj.LastName = data[i]['Last Name'];
            obj.Gender = data[i]['Gender'];
            obj.Address = data[i]['Address'];
            obj.Email = data[i]['Email'];
            obj.Mobile = data[i]['Mobile'];
            obj.NextOfKinContact = data[i]['NextOfKinContact'];
            obj.Category = data[i]['Category'];
            obj.Role = data[i]['Role'];
            obj.Active = data[i]['Active'];
            teacherArray.push(obj);
        }
        return teacherArray;

    }
    const handleSubmit = e => {
        e.preventDefault();
        var teacherObj = creatObject();
        if (teacherObj != null && teacherObj.length > 0) {
            service.sendPostRequest(teacherObj, 'Teacher')
                .then((response) => { studentSaveSuccess(response) })
                .catch((error) => { studentSaveFailure(error.response) });
        }

    }
    const studentSaveSuccess = (result) => {
        if (result) {
            toast.success("Record Saved Successfully");
            setStaffs([]);
        }
    }
    const creatObject = () => {
        var studentArray = [];
        for (let i = 0; i < staffs.length; i++) {
            var isValid = validation(staffs[i]);
            if (isValid) {
                debugger
                var obj = {};
                obj.Id = i;
                obj.RefNo = staffs[i]['RefNo'];
                obj.Title = staffs[i]['Title'];
                obj.FirstName = staffs[i]['FirstName'];
                obj.LastName = staffs[i]['LastName'];
                obj.Gender =  Number(staffs[i]['Gender']);
                obj.Address = staffs[i]['Address'];
                obj.Email = staffs[i]['Email'];
                obj.Mobile = staffs[i]['Mobile'];
                obj.NextOfKinContact = staffs[i]['NextOfKinContact'];
                obj.Category = staffs[i]['Category'];
                obj.Role = staffs[i]['Role'];
                obj.IsActive = staffs[i]['Active'];
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
        if (data.RefNo == undefined) {
            toast.warn("Ref No No is required");
            return false
        }
        if (data.FirstName == undefined) {
            toast.warn("First Name of Ref No " + data.RefNo + "  Name is required");
            return false

        }
        if (data.LastName == undefined) {
            toast.warn("Last Name of Ref No " + data.RefNo + "  is required");
            return false

        }
        if (data.Gender == undefined) {
            toast.warn("Full Name of Ref No " + data.RefNo + "  is required");
            return false
        }
        if (data.Address == undefined) {
            toast.warn("Address of Ref No " + data.RefNo + "  is required");
            return false
        }
        if (data.Mobile == undefined) {
            toast.warn("Mobile no of Ref No " + data.RefNo + "  is required");
            return false
        }
        if (data.Email == undefined) {
            toast.warn("Email of Ref No " + data.RefNo + "  is required");
            return false
        }
        if (data.Category == undefined) {
            toast.warn("Category of Ref No " + data.RefNo + "  is required");
            return false
        }
        if (data.Role == undefined) {
            toast.warn("Role of Ref No " + data.RefNo + "  is required");
            return;
        }
        if (data.NextOfKinContact == undefined) {
            toast.warn("Next Of Kin Contact of Ref No " + data.RefNo + "  is required");
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
        var index = staffs.findIndex(x => x.Id == values.Id); //update item that saved in db

        if (index > -1) {
            let newStudents = [...staffs];  //get old values to another list
            newStudents[index] = values;
            newStudents[index].Gender= newStudents[index].Gender=="1"?"Make":"Female";
            setStaffs(newStudents)
            setShow(false);
        }
        else {
            setStaffs([...staffs, values]);
            setShow(false);

        }

    }
    const validationSchema = Yup.object().shape({
        Title: Yup.string().trim()
            .required('Title is required.'),
        FirstName: Yup.string().trim()
            .required('First Name is required.'),
        LastName: Yup.string().trim()
            .required('Last Name is required.'),
        Gender: Yup.string().trim()
            .required('Gender is required.'),
        Address: Yup.string().trim()
            .required('Permanent Address  is required.'),
        Email: Yup.string().trim()
            .required('Email is required.').
            email('Email is invalid'),
        NextOfKinContact: Yup.string().trim()
            .required('Next Of Kin Contact is required.'),
        RefNo: Yup.string().trim()
            .required('Ref No is required.'),
        Category: Yup.string().trim()
            .required('Category No is required.'),
        Mobile: Yup.string().trim()
            .required('Mobile is required.')
            .test('alphabets', 'Mobile is invalid', (value) => {
                if (value == undefined) return true;
                return value = !undefined && /^\d{3}-?\d{3}-?\d{4}$/.test(value);
            }),

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
        setStaff({ ...initialValues });
    }
    const cellRender = (data) => {
        return <div>
            <a onClick={() => update(data.key)} style={{ 'color': 'blue' }}><u>{data.key.RefNo}</u></a></div>
    }
    const update = (data) => {
        debugger
        setShow(true);
        data.Gender=data.Gender=="Male"?1:0;
        let newStudents = {...data}//get old values to another list
        setStaff(newStudents);
    }

    const showInstituteValidateMsg = (field) => {
        if (instituteError[field]) {
            return <small className="form-text text-muted">{instituteError[field]}</small>
        }
    }
    return (
        <>

            <Modal show={show} onHide={handleClose} animation={true} size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Staff</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik initialValues={staff}
                        enableReinitialize={true}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit} >
                        {({ errors, status, touched, handleChange, values, setFieldValue, setFieldTouched, isSubmitting, resetForm }) => (
                            <Form>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputEmail4">Ref No</label>
                                        <Field name="RefNo" className="form-control" maxLength="50" />
                                        <ErrorMessage name="RefNo" component="div" className="invalid-feedback d-block" />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputEmail4">Title</label>
                                        <select name="Title" className="form-control" onChange={(e)=>setFieldValue("Title", e.target.value)} value={values.Title}>
                                            <option value="">Select</option>
                                            <option value='Mr'>Mr</option>
                                            <option value='Mrs'>Mrs</option>
                                        </select>
                                        <ErrorMessage name="Title" component="div" className="invalid-feedback d-block" />
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
                                <div class="form-row">
                                    <div class="form-group  col-md-6">
                                        <label for="inputAddress">Gender</label>
                                        <select name="Gender" className="form-control" onChange={(e)=>setFieldValue("Gender", e.target.value)} value={values.Gender}>
                                            <option value="">Select</option>
                                            <option value='1'>Male</option>
                                            <option value='0'>Female</option>
                                        </select>
                                        <ErrorMessage name="Gender" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="inputAddress2"> Address</label>
                                    <Field name="Address" className="form-control" as="textarea" />
                                    <ErrorMessage name="Address" component="div" className="invalid-feedback d-block" />
                                </div>

                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Mobile</label>
                                        <Field name="Mobile" className="form-control" />
                                        <ErrorMessage name="Mobile" component="div" className="invalid-feedback d-block" />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Email</label>
                                        <Field name="Email" className="form-control" maxLength="150" />
                                        <ErrorMessage name="Email" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Next Of Kin Contact</label>
                                        <Field name="NextOfKinContact" className="form-control" />
                                        <ErrorMessage name="NextOfKinContact" component="div" className="invalid-feedback d-block" />
                                    </div>
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Category</label>
                                        <Field name="Category" className="form-control" maxLength="150" />
                                        <ErrorMessage name="Category" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-6">
                                        <label for="inputAddress">Role</label>
                                        <Field name="Role" className="form-control" />
                                        <ErrorMessage name="Role" component="div" className="invalid-feedback d-block" />
                                    </div>
                                </div>
                                <div class="form-row">
                                    <div class="form-group col-md-4">
                                        <label for="inputAddress" for="chkActive">Active</label>
                                        <Field name="Active"  type="checkbox" id="chkActive" className="mr-2"/>
                                        <ErrorMessage name="Active" component="div" className="invalid-feedback d-block" />
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
                            <select className="form-control" name="instituteId" onChange={(e) => setInstitute(e.target.value)}>
                                <option value=''>Select</option>
                                {institutes.map((v) => (
                                    <option value={v.InstituteId}  >{v.InsName}</option>// value coming from prop
                                ))}
                            </select>
                            {showInstituteValidateMsg('institute')}
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
                    dataSource={staffs}
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
                    <Column dataField="RefNo" cellRender={cellRender}><RequiredRule /></Column>
                    <Column dataField="Title"><RequiredRule /></Column>
                    <Column dataField="FirstName" ><RequiredRule /></Column>
                    <Column dataField="LastName" ><RequiredRule /></Column>
                    <Column dataField="Gender" ><RequiredRule /></Column>
                    <Column dataField="Address" />
                    <Column dataField="Mobile" ><RequiredRule /></Column>
                    <Column dataField="Email" ><EmailRule /></Column>
                    <Column dataField="NextOfKinContact" />
                    <Column dataField="Category" ><RequiredRule /></Column>
                    <Column dataField="Role"><RequiredRule /></Column>
                    <Column dataField="Active"><RequiredRule /></Column>

                </DataGrid>
                <br />
                <div class="row">
                    <button class="btn btn-primary" onClick={handleSubmit}>Process</button>
                </div>
            </div>

        </>
    )


}
