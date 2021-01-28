import React, { Component } from 'react';
import { ReCaptcha } from 'react-recaptcha-google'

class Captcha extends Component {
    constructor(props, context) {
        super(props, context);
        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);
        this.state = { isVerified: false};
      }

      componentDidMount() {
        if (this.captchaDemo) {
            console.log("started, just a second...")
            this.captchaDemo.reset();
        }
      }
      onLoadRecaptcha() {
          if (this.captchaDemo) {
              this.captchaDemo.reset();
          }
      }
      verifyCallback(recaptchaToken) {
        // Here you will get the final recaptchaToken!!!  
        if(recaptchaToken){
         this.setState({isVerified:true});
         this.props.verifiedCaptcha(this.state.isVerified);
        }
      }
      render() {
        return (
          <div>
            {/* You can replace captchaDemo with any ref word */}
            <ReCaptcha
                ref={(el) => {this.captchaDemo = el;}}
                size="normal"
                data-theme="dark"            
                render="explicit"
                sitekey="6LexwvUZAAAAADbfjgviQwmel_FTXu76rRDE8sx_"
                onloadCallback={this.onLoadRecaptcha}
                verifyCallback={this.verifyCallback}
            />
           
          </div>
        );
      };
};
export default Captcha;