  import { useState, useCallback, useRef } from "react";
import Modal from "react-modal/lib/components/Modal";
  import deliveryMap from "../assets/delivery_map.png";
import { TextField } from "./TextField.client";

  export function AccountModal() {
    const [activeSignin, setActiveSignin] = useState(false);
    const [activeCreate, setActiveCreate] = useState(false);
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVerify, setPasswordVerify] = useState('');
    const [showBadPassword, setShowBadPassword] = useState(false);
    const node = useRef(null);

    const handleSubmitSignIn = () => {
        if (password !== 'jtbt7c') {
            setTimeout(() => {
                setShowBadPassword(true);
                setPassword('');
            }, 1000);
        } else {
            
        }
    
    };

    const handleCreateAccount = () => {
        dismissModals();
        setActiveCreate(true);
    }

    const handleFocus = useCallback(() => {
        if (node.current == null) {
          return;
        }
        node.current.input.select();
        document.execCommand("copy");
      }, []);
    
      const toggleModal = useCallback(() => {
          setActiveSignin(true)
      }, []);
  
      const dismissModals = () => {
          setActiveSignin(false);
          setActiveCreate(false);
      };

      const isValidEmail = () => {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
    }

    const isValidPassword = () => {
        return password.length > 3;
    }

      const activator = <button onClick={toggleModal}>Open Account Modal</button>;
  
    return (
      <div className="modal--signin">

        {activator}
        
        {/* Sign In */}
        <Modal
          activator={activator}
          isOpen={activeSignin}
          onRequestClose={dismissModals}
        >
          <section className="modal--signin-inner">            
            <div>
                <h2 className="modal-heading text-center">Sign in to your account to continue</h2>
            </div>

            <TextField
                ref={node}
                label="Email"
                onFocus={handleFocus}
                value={email}
                placeholder={"Enter email address"}
                maxLength={100}
                onChange={(email) => {setEmail(email)}}
                autoComplete="off"
            />
            <TextField
                ref={node}
                label="Password"
                type="password"
                onFocus={handleFocus}
                value={password}
                placeholder={"Enter password"}
                maxLength={20}
                onChange={(password) => {setPassword(password)}}
                autoComplete="off"
            />
            <div className="text-center">
                { showBadPassword && <p className="password-incorrect">Incorrect password</p> }
                <button className={`btn btn-confirm btn-modal${(!isValidEmail() || !isValidPassword()) ? ' btn-disabled' : ''}`} primary onClick={handleSubmitSignIn}>
                    Sign In
                </button>
            </div>
          </section>

          <section className="modal--signin-lower">
            <h2 className="modal-subheading text-center">New to Home Appétit?</h2>
            <p className="text-center padding-10v">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Enim urna mi pulvinar ac dui.</p>

            <div className="text-center">
                <button className="btn btn-confirm btn-small" onClick={handleCreateAccount}>Create an Account</button>
                <button className="btn btn-secondary btn-small">Continue as Guest</button>
            </div>
          </section>
        </Modal>

        {/* Create Account */}
        <Modal
          open={activeCreate}
          onClose={dismissModals}
        >
          <section className="modal--create-inner">            
            <div className="padding-20v">
                <h2 className="modal-heading text-center">Create your new account</h2>
                <p className="text-center">Please provide your delivery ZIP code to confirm that you are in our delivery area:</p>
            </div>

            <TextField
                ref={node}
                label="Zipcode"
                onFocus={handleFocus}
                value={zipcode}
                placeholder={"Enter delivery ZIP"}
                maxLength={100}
                onChange={(zipcode) => {setZipcode(zipcode)}}
                autoComplete="off"
            />
            <br></br>
            <TextField
                ref={node}
                label="Email"
                onFocus={handleFocus}
                value={email}
                placeholder={"Enter email address"}
                maxLength={100}
                onChange={(email) => {setEmail(email)}}
                autoComplete="off"
            />
            <br></br>
            <TextField
                ref={node}
                label="Password"
                type="password"
                onFocus={handleFocus}
                value={password}
                placeholder={"Enter password"}
                maxLength={20}
                onChange={(password) => {setPassword(password)}}
                autoComplete="off"
            />
            <br></br>
            <TextField
                ref={node}
                label="Confirm Password"
                type="password"
                onFocus={handleFocus}
                value={passwordVerify}
                placeholder={"Re-enter password"}
                maxLength={20}
                onChange={(passwordVerify) => {setPasswordVerify(passwordVerify)}}
                autoComplete="off"
            />
            <div className="text-center">
                <button className={`btn btn-confirm btn-modal${(!isValidEmail() || !isValidPassword() || password !== passwordVerify) ? ' btn-disabled' : ''}`} primary onClick={handleSubmitSignIn}>
                    Create Account
                </button>
            </div>
          </section>
        </Modal>
      </div>
    );
  }