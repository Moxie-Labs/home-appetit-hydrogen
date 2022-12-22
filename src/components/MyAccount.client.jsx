import React, {useCallback, useEffect, useState} from 'react';
import { gql } from '@shopify/hydrogen';
import PersonalInfo from '../components/Account/PersonalInfo.client';
import Payment from '../components/Account/Payment.client';
import Orders from '../components/Account/Orders.client';
import Communication from '../components/Account/Communication.client';
import GiftCards from '../components/Account/GiftCards.client';
import { useRenderServerComponents, removePhoneNumberFormatting } from '~/lib/utils';
import { render } from 'react-dom';
import { Page } from './Page.client';
import { Header } from './Header.client';
import { Footer } from './Footer.client';
import iconDropdownArrow from "../assets/icon-dropdown-arrow.png";
import iconDropdownReverse from "../assets/icon-dropdown-reverse.png";
import Referrals from './Account/Referrals.client';


export default function MyAccount(props) {

    const { customer, zipcodeArr } = props;

    const [activeTab, setActiveTab] = useState('info');
    const [agreeConsent, setAgreeConsent] = useState(false);
    const [receiveConsent, setReceiveConsent] = useState(false);

    // Editable Fields
    const [saving, setSaving] = useState(false);
    const [firstName, setFirstName] = useState(customer.firstName);
    const [lastName, setLastName] = useState(customer.lastName);
    const [phone, setPhone] = useState(customer.phone);
    const [email, setEmail] = useState(customer.email);
    const [emailError, setEmailError] = useState(null);
    const [currentPasswordError, setCurrentPasswordError] = useState(null);
    const [acceptsMarketing, setAcceptsMarketing] = useState(customer.acceptsMarketing);
    const [newPasswordError, setNewPasswordError] = useState(null);
    const [newPassword2Error, setNewPassword2Error] = useState(null);
    const [submitError, setSubmitError] = useState(null);

    const renderServerComponents = useRenderServerComponents();
    const {orders} = props;

    useEffect(() => {
      if (window.location.hash === '#orders')
        setActiveTab('orders')
      if (window.location.hash === '#referrals')
        setActiveTab('referrals')
    }, []);

    const updateCustomerInfo = async (firstName, lastName, email, phone) => {

        let updatePayload = {
          firstName,
          lastName,
          email
        }

        if (phone !== null)
          updatePayload.phone = `+${removePhoneNumberFormatting(phone)}`

        await callAccountUpdateApi(updatePayload);

        renderServerComponents();
    }


    async function updateCommunicationPreferences(newPreferences) {
        renderServerComponents();
        await callAccountUpdateApi({
            acceptsMarketing: newPreferences.acceptsMarketing
        });

        setAcceptsMarketing(newPreferences.acceptsMarketing)

        renderServerComponents();
    }

    async function updateAddress(newAddress) {
        const {
            id,
            firstName,
            lastName,
            company,
            address1,
            address2,
            country,
            province,
            city,
            phone,
            zip,
            isDefaultAddress,
        } = newAddress;

        await callUpdateAddressApi({
            id,
            firstName,
            lastName,
            company,
            address1,
            address2,
            country,
            province,
            city,
            phone,
            zip,
            isDefaultAddress,
        });

        renderServerComponents();
    }

    async function addAddress(newAddress) {
        const {
            firstName,
            lastName,
            company,
            address1,
            address2,
            country,
            province,
            city,
            phone,
            zip,
            isDefaultAddress,
        } = newAddress;

        await callUpdateAddressApi({
            firstName,
            lastName,
            company,
            address1,
            address2,
            country,
            province,
            city,
            phone,
            zip,
            isDefaultAddress,
        });

        renderServerComponents();
    }

    async function removeAddress(addressId) {
        await callDeleteAddressApi(addressId);
        renderServerComponents();
    }

    async function defaultAddress(defaultAddress) {
        const {
            id,
            firstName,
            lastName,
            company,
            address1,
            address2,
            country,
            province,
            city,
            phone,
            zip,
            isDefaultAddress,
        } = defaultAddress;

        await callUpdateAddressApi({
            id,
            firstName,
            lastName,
            company,
            address1,
            address2,
            country,
            province,
            city,
            phone,
            zip,
            isDefaultAddress,
        });

        renderServerComponents();
    }

    function personalInfoPanel (){
      return(
        <section className='account-panel-body'>
        <PersonalInfo
            customer={customer}
            zipcodeArr={zipcodeArr}
            acceptsMarketing={acceptsMarketing}
            handleUpdatePersonal={(firstName, lastName, email, phone) => updateCustomerInfo(firstName, lastName, email, phone)}
            handleUpdateCommunication={(value) => updateCommunicationPreferences(value)}
            handleUpdateAddress={(newAddress) => updateAddress(newAddress)}
            handleRemoveAddress={(addressId) => removeAddress(addressId)}
            handleNewAddress={(newAddress) => addAddress(newAddress)}
            handleUpdateDefault={(address) => defaultAddress(address)}
        /> 
        </section>
      )
    }

    function ordersPanel(){
      return(
        <section className='account-panel-body'>
          <Orders
            orders={orders}
            customer={customer}
            payments={customer.payments}
            handleViewOrder={() => {;}}
          /> 
        </section>
      )
    }

    function giftCardsPanel(){
      return(
        <section className='account-panel-body'>
        <GiftCards
            customer={customer}
        /> 
        </section>
      )
    }

    function referralsPanel(){
      return (
        <section className='account-panel-body'>
          <Referrals
            orderCount={orders.length}
            customer={customer}
          /> 
        </section>
      );
    }

    const toggleTab = tabName => {
      if (activeTab === tabName)
        setActiveTab("");
      else 
        setActiveTab(tabName);
    }

    return (
      <Page>
      <Header 
      isOrdering = {false} />
        <div className='myaccount-wrapper'>
        <h1 className='myaccount-heading ha-h2 text-center'>My Account</h1>
        
        <div className='myaccount-page desktop-panel'>
            <section className='account-panel-switches'>
                <h2 className={`account-panel-switch${ activeTab === 'info' ? ' active' : '' }`} onClick={() => toggleTab('info')}>Personal Info</h2>
                <h2 className={`account-panel-switch${ activeTab === 'orders' ? ' active' : '' }`} onClick={() => toggleTab('orders')}>Orders</h2>
                <h2 className={`account-panel-switch${ activeTab === 'referrals' ? ' active' : '' }`} onClick={() => toggleTab('referrals')}>Referrals</h2>
            </section>
                { activeTab === 'info' &&
                    personalInfoPanel()
                }

                { activeTab === 'orders' &&
                    ordersPanel()
                }

                { activeTab === 'referrals' &&
                    referralsPanel()
                }
        </div>
        <div className='myaccount-page mobile-panel'>
              <section className='account-panel-switches'>
                  <h2 className={`account-panel-switch${ activeTab === 'info' ? ' active' : '' }`} onClick={() => toggleTab('info')}>Personal Info &nbsp;<span>{activeTab === 'info' && <img src={iconDropdownReverse} alt="" />}{activeTab != 'info' && <img src={iconDropdownArrow} alt="" />}</span></h2>
                      { activeTab === 'info' &&
                          personalInfoPanel()
                      }
                  {/* <h2 className={`account-panel-switch${ activeTab === 'payment' ? ' active' : '' }`} style={{opacity: 0.6}} onClick={() => null}>Payment &nbsp;<span>{activeTab === 'payment' && <img src={iconDropdownReverse} alt="" />}{activeTab != 'payment' && <img src={iconDropdownArrow} alt="" />}</span></h2>
                      { activeTab === 'payment' &&
                          paymentPanel()
                      } */}
                  <h2 className={`account-panel-switch${ activeTab === 'orders' ? ' active' : '' }`} onClick={() => toggleTab('orders')}>Orders &nbsp;<span>{activeTab === 'orders' && <img src={iconDropdownReverse} alt="" />}{activeTab != 'orders' && <img src={iconDropdownArrow} alt="" />}</span></h2>
                      { activeTab === 'orders' &&
                          ordersPanel()
                      }
                  <h2 className={`account-panel-switch${ activeTab === 'referrals' ? ' active' : '' }`} onClick={() => toggleTab('referrals')}>Referrals &nbsp;<span>{activeTab === 'referrals' && <img src={iconDropdownReverse} alt="" />}{activeTab != 'referrals' && <img src={iconDropdownArrow} alt="" />}</span></h2>
                    { activeTab === 'orders' &&
                        ordersPanel()
                    }
                  {/* <h2 className={`account-panel-switch${ activeTab === 'gift_cards' ? ' active' : '' }`} onClick={() => setActiveTab('gift_cards')}>Gift Cards & Referrals &nbsp;<span>{activeTab === 'gift_cards' && <img src={iconDropdownReverse} alt="" />}{activeTab != 'gift_cards' && <img src={iconDropdownArrow} alt="" />}</span></h2>
                      { activeTab === 'gift_cards' &&
                          giftCardsPanel()
                      } */}
              </section>
            </div>
        </div>

        <Footer />
    </Page>

    );
}

export async function callAccountUpdateApi({
    email,
    phone,
    firstName,
    lastName,
    currentPassword,
    newPassword,
    acceptsMarketing
  }) {
    try {
      const res = await fetch(`/account`, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone,
          firstName,
          lastName,
          currentPassword,
          newPassword,
          acceptsMarketing
        }),
      });
      if (res.ok) {
        return {};
      } else {
        return res.json();
      }
    } catch (_e) {
      return {
        error: 'Error saving account. Please try again.',
      };
    }
  }

  export async function callUpdateAddressApi({
    id,
    firstName,
    lastName,
    company,
    address1,
    address2,
    country,
    province,
    city,
    phone,
    zip,
    isDefaultAddress,
  }) {
    try {
      const res = await fetch(
        id ? `/account/address/${encodeURIComponent(id)}` : '/account/address',
        {
          method: id ? 'PATCH' : 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            firstName,
            lastName,
            company,
            address1,
            address2,
            country,
            province,
            city,
            phone,
            zip,
            isDefaultAddress,
          }),
        },
      );
      if (res.ok) {
        return {};
      } else {
        return res.json();
      }
    } catch (_e) {
      return {
        error: 'Error saving address. Please try again.',
      };
    }
  }

  async function callDeleteAddressApi(id) {
    try {
      const res = await fetch(`/account/address/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
        },
      });
      if (res.ok) {
        return {};
      } else {
        return res.json();
      }
    } catch (_e) {
      return {
        error: 'Error removing address. Please try again.',
      };
    }
  }