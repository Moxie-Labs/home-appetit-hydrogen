  import { useState, useCallback, useRef } from "react";
import Modal from "react-modal/lib/components/Modal";
  import deliveryMap from "../assets/delivery_map.png";
import { LayoutSection } from "./LayoutSection.client";
import { TextField } from "./TextField.client";

  const VALID_ZIPCODES = [19019, 19092, 19093, 19099, 19101, 19102, 19103, 19104, 19105, 19106, 19107, 19108, 19109, 19110, 19111, 19112, 19113, 19114, 19115, 19116, 19118, 19119, 19120, 19121, 19122, 19123, 19124, 19125, 19126, 19127, 19128, 19129, 19130, 19131, 19132, 19133, 19134, 19135, 19136, 19137, 19138, 19139, 19140, 19141, 19142, 19143, 19144, 19145, 19146, 19147, 19148, 19149, 19150, 19151, 19152, 19153, 19154, 19155, 19160, 19161, 19162, 19170, 19171, 19172, 19173, 19175, 19176, 19177, 19178, 19179, 19181, 19182, 19183, 19184, 19185, 19187, 19188, 19190, 19191, 19192, 19193, 19194, 19195, 19196, 19197, 19244, 19255];
  const QUALIFIED_ZIPCODES = [17752, 19013, 19014, 19015, 19016, 19022, 17777];

  export default function GuestSignupModal() {
    const DISCOUNT_LINK = "https://polaris.shopify.com/";
  
    const [activeIntro, setActiveIntro] = useState(false);
    const [activeSuccess, setActiveSuccess] = useState(false);
    const [activeQualified, setActiveQualified] = useState(false);
    const [activeFailure, setActiveFailure] = useState(false);
    const [zipcode, setZipcode] = useState('');
    const [email, setEmail] = useState('');
    const node = useRef(null);
  
    const handleSubmitIntro = useCallback(() => {
        setActiveIntro(false);
      if (VALID_ZIPCODES.includes(parseInt(zipcode))) {
        setActiveSuccess(true);
        console.log("Success");
      } else if (QUALIFIED_ZIPCODES.includes(parseInt(zipcode))) {
        setActiveQualified(true);
        console.log("Qualified");
      } else {
        setActiveFailure(true);
        console.log("Failure");
      }
      
    }, []);

    const handleSubmitSuccess = useCallback(() => {
        window.location.replace("/admin/apps/home_appetit-1/datamodel");
    });

    const handleSubmitNewsletter = useCallback(() => {
        dismissModals();
    });
  
    const handleFocus = useCallback(() => {
      if (node.current == null) {
        return;
      }
      node.current.input.select();
      document.execCommand("copy");
    }, []);
  
    const toggleModal = useCallback(() => {
        setActiveIntro(true)
    }, []);

    const dismissModals = () => {
        setActiveIntro(false)
        setActiveSuccess(false)
        setActiveQualified(false)
        setActiveFailure(false)
    };
  
    const activator = <button onClick={toggleModal}>Open Guest Signup</button>;

    const isValidZipcode = () => {
        return zipcode.length === 5;
    }

    const isValidEmail = () => {
        return email.includes("@");
    }
  
    return (
      <div className="modal--guest-signup">

        {activator}
        
        {/* Intro */}
        <Modal
          isOpen={activeIntro}
          onRequestClose={dismissModals}
        >
          <section className="modal--guest-signup-inner">            
            <div>
                <h2 className="modal-heading text-center">Continue as Guest</h2>
                <p className="modal-text text-center">
                    To continue as a guest, we just need your email and ZIP code to confirm that you are in our delivery area:
                </p>
            </div>

            <TextField
                ref={node}
                type="number"
                label="Delivery Zip"
                onFocus={handleFocus}
                value={zipcode}
                placeholder={"Enter delivery address ZIP"}
                maxLength={5}
                onChange={(zipcode) => {setZipcode(zipcode)}}
                autoComplete="off"
            />
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
            <div className="text-center">
                <button className={`btn btn-confirm btn-modal${(!isValidZipcode() || !isValidEmail()) ? ' btn-disabled' : ''}`} primary onClick={handleSubmitIntro}>
                    Continue as Guest
                </button>
            </div>
          </section>
        </Modal>

        {/* Success Modal */}
        <Modal
          isOpen={activeSuccess}
          onRequestClose={dismissModals}
        >
          <section className="modal-section">
            <h2 className="heading modal-heading text-center">We deliver to you!!!!</h2>
            <section className="modal--left">
                <div className="modal--left-inner">
                    <div className="modal--left-inner-content">
                        <p className="modal-text text-left">Lorem ipsum dolor sit amet, ested i consectetur adipiscing elit. Montes, ultricies tristique quam dolor quam massa, morbi.</p>
                        <br></br>
                        <p className="modal-text text-left">Feugiat posuere eget id rhoncus, risus ornare. Mollis id tempor non vestibulum nam duis tempor amet.</p>
                        <button className={`btn btn-confirm btn-modal`} primary onClick={handleSubmitSuccess}>
                            Start Order
                        </button>
                    </div>
                </div>
                </section>
                <section className="modal--right">
                    <img src={deliveryMap}/>
                </section>
          </section>
        </Modal>

        {/* Failure Modal */}
        <Modal
          isOpen={activeFailure}
          onRequestClose={dismissModals}
        >
          <section className="modal-section">
            <h2 className="heading text-center">Sorry...</h2>
            <section className="modal--left">
                <div className="modal--left-inner">
                    <div className="modal--left-inner-content">
                        <p className="modal-text text-left">It looks like your delivery location is not within our current delivery area.</p>
                        <br></br>
                        <p className="modal-text text-left">Make sure to subscribe to our newsletter to stay up to date on when we come to your area!</p>
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
                        <button className={`btn btn-confirm btn-modal`} primary onClick={handleSubmitNewsletter}>
                            Subscribe
                        </button>
                    </div>
                </div>
                </section>
                <section className="modal--right">
                    <img src={deliveryMap}/>
                </section>
          </section>
        </Modal>

        {/* Qualified Modal */}
        <Modal
          isOpen={activeQualified}
          onRequestClose={dismissModals}
        >
          <section className="modal-section">
            <h2 className="heading modal-heading text-center">We can still deliver to you!!!!</h2>
            <section className="modal--left">
                <div className="modal--left-inner">
                    <div className="modal--left-inner-content">
                        <p className="modal-text text-left">Lorem ipsum dolor sit amet, ested i consectetur adipiscing elit. Montes, ultricies tristique quam dolor quam massa, morbi.</p>
                        <br></br>
                        <p className="modal-text text-left">Feugiat posuere eget id rhoncus, risus ornare. Mollis id tempor non vestibulum nam duis tempor amet.</p>
                        <button className={`btn btn-confirm btn-modal`} primary onClick={handleSubmitSuccess}>
                            Start Order
                        </button>
                    </div>
                </div>
                </section>
                <section className="modal--right">
                    <img src={deliveryMap}/>
                </section>
          </section>
        </Modal>

        <LayoutSection>

            <hr></hr>

            <h2 className="underline">Debug Values</h2>

            <p>zipcode: {zipcode}</p>
            <p>email: {email}</p>
            <p>activeIntro: {activeIntro === true}</p>
            <p>activeSuccess: {activeSuccess}</p>
            <p>activeQualified: {activeQualified}</p>
            <p>activeFailure: {activeFailure}</p>

        </LayoutSection>
      </div>
    );
  }