import React, {useCallback, useState} from 'react';
import { gql } from '@shopify/hydrogen';
import PersonalInfo from '../components/Account/PersonalInfo.client';
import Payment from '../components/Account/Payment.client';
import Orders from '../components/Account/Orders.client';
import Communication from '../components/Account/Communication.client';
import GiftCards from '../components/Account/GiftCards.client';
import { useRenderServerComponents, removePhoneNumberFormatting } from '~/lib/utils';
import { render } from 'react-dom';

export default function MyAccount(props) {

    const { customer } = props;

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

    /* GraphQL Simulation */
    let customerData = {
        "customer": {
            "id": "gid://shopify/Customer/410535040",
            "firstName": "Jon Paul",
            "lastName": "Simonelli",
            "acceptsMarketing": false,
            "email": "jpsimonelli@moxielabs.co",
            "phone": "+19739340784",
            "addresses": [{
                "address1": "121 Mayberry Road",
                "address2": "",
                "city": "Catawissa",
                "company": "",
                "country": "United Stated",
                "id": "PLACEHOLDER",
                "firstName": "Jon Paul",
                "lastName": "Simonelli",
                "phone": "+19739340784",
                "zip": "17820"
            }],
            "orders": [{
                "orderNumber": "1001",
                "processedAt": new Date("2022-08-28T15:50:00Z"),
                "fulfillmentStatus": "UNFULFILLED",
                "totalPriceV2": {
                    "amount": 38.0
                }
            },
            {
                "orderNumber": "1002",
                "processedAt": new Date("2022-08-28T15:50:00Z"),
                "fulfillmentStatus": "FULFILLED",
                "totalPriceV2": {
                    "amount": 38.0
                }
            }],
            "payments": [{
                "brand": "Visa",
                "expiryMonth": 10,
                "expiryYear": 22,
                "maskedNumber": "****1111"
            },
            {
                "brand": "Visa",
                "expiryMonth": 10,
                "expiryYear": 22,
                "maskedNumber": "****1112"
            }]
        },
        "rewards": {
            "giftCardBalance": 0.0,
            "referralBalance": 0.0
        }
    };

    // const [customer, setCustomer] = useState(customerData.customer);

     // temp
     const [payments, setPayments] = useState(customer.payments);

     const [rewards, setRewards] = useState(customerData.rewards);


    const addCard = (number, name, expiry) => {
        const newPayments = [...customer.payments];
        const newCustomer = customer;
        newPayments.push({
            "brand": "Visa",
            "expiryMonth": 10,
            "expiryYear": 25,
            "maskedNumber": "**** 1113"
        });
        newCustomer.payments = newPayments;
        setCustomer(newCustomer);
    }

    const removeCard = index => {
        console.log("removing card at", index)
        let newPayments = [...customer.payments];
        let newCustomer = {...customer};
        newPayments.splice(index, 1);
        newCustomer.payments = newPayments;
        setCustomer(newCustomer);
        console.log("newCustomer", newCustomer)
    }

    const updateCustomerInfo = async (firstName, lastName, email, phone) => {
        await callAccountUpdateApi({
            firstName,
            lastName,
            email,
            phone: `+${removePhoneNumberFormatting(phone)}`
        });

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

    

    return (
        <div className='myaccount-page'>
            <h1 className='heading text-center'>My Account</h1>

            <section className='account-panel-switches'>
                <h2 className={`account-panel-switch${ activeTab === 'info' ? ' active' : '' }`} onClick={() => setActiveTab('info')}>Personal Info</h2>
                <h2 className={`account-panel-switch${ activeTab === 'payment' ? ' active' : '' }`} onClick={() => setActiveTab('payment')}>Payment</h2>
                <h2 className={`account-panel-switch${ activeTab === 'orders' ? ' active' : '' }`} onClick={() => setActiveTab('orders')}>Orders</h2>
                <h2 className={`account-panel-switch${ activeTab === 'gift_cards' ? ' active' : '' }`} onClick={() => setActiveTab('gift_cards')}>Gift Cards & Referrals</h2>
            </section>

            <section className='account-panel-body'>
                { activeTab === 'info' &&
                    <PersonalInfo
                        customer={customer}
                        acceptsMarketing={acceptsMarketing}
                        handleUpdatePersonal={(firstName, lastName, email, phone) => updateCustomerInfo(firstName, lastName, email, phone)}
                        handleUpdateCommunication={(value) => updateCommunicationPreferences(value)}
                        handleUpdateAddress={(newAddress) => updateAddress(newAddress)}
                        handleRemoveAddress={(addressId) => removeAddress(addressId)}
                        handleNewAddress={(newAddress) => addAddress(newAddress)}
                        handleUpdateDefault={(address) => defaultAddress(address)}
                    /> 
                }

                { activeTab === 'payment' &&
                    <Payment
                        customer={customer}
                        payments={customer.payments}
                        handleAddCard={(number, name, expiry) => addCard(number, name, expiry)}
                        handleRemoveCard={(index) => removeCard(index)}
                    /> 
                }

                { activeTab === 'orders' &&
                    <Orders
                        customer={customer}
                    /> 
                }

                { activeTab === 'gift_cards' &&
                    <GiftCards
                        customer={customer}
                        giftBalance={rewards.giftCardBalance}
                        referralCredit={rewards.referralBalance}
                    /> 
                }
            </section>

        </div>
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