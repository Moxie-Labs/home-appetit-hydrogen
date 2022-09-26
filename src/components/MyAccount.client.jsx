import React, {useCallback, useState} from 'react';
import PersonalInfo from '../components/Account/PersonalInfo.client';
import Payment from '../components/Account/Payment.client';
import Orders from '../components/Account/Orders.client';
import Communication from '../components/Account/Communication.client';
import GiftCards from '../components/Account/GiftCards.client';

export default function MyAccount(props) {

    const [activeTab, setActiveTab] = useState('info');
    const [agreeConsent, setAgreeConsent] = useState(false);
    const [receiveConsent, setReceiveConsent] = useState(false);

    const {orders} = props;

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

    const [customer, setCustomer] = useState(customerData.customer);

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

    const updateCustomerInfo = (firstName, lastName, email, phone) => {
        let newCustomer = {...customer};
        newCustomer.firstName = firstName;
        newCustomer.lastName = lastName;
        newCustomer.email = email;
        newCustomer.phone = phone;
        setCustomer(newCustomer);
    }

    return (
        <div className='myaccount-page'>
            <h1 className='heading text-center'>My Account</h1>

            <section className='account-panel-switches'>
                <h2 className={`account-panel-switch${ activeTab === 'info' ? ' active' : '' }`} onClick={() => setActiveTab('info')}>Personal Info</h2>
                <h2 className={`account-panel-switch${ activeTab === 'payment' ? ' active' : '' }`} onClick={() => setActiveTab('payment')}>Payment</h2>
                <h2 className={`account-panel-switch${ activeTab === 'orders' ? ' active' : '' }`} onClick={() => setActiveTab('orders')}>Orders</h2>
                <h2 className={`account-panel-switch${ activeTab === 'gift_cards' ? ' active' : '' }`} onClick={() => setActiveTab('gift_cards')}>Gift Cards & Referrals</h2>
                <h2 className={`account-panel-switch${ activeTab === 'comm' ? ' active' : '' }`} onClick={() => setActiveTab('comm')}>Communication Preferences</h2>
            </section>

            <section className='account-panel-body'>
                { activeTab === 'info' &&
                    <PersonalInfo
                        customer={customer}
                        handleUpdatePersonal={(firstName, lastName, email, phone) => updateCustomerInfo(firstName, lastName, email, phone)}
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
                        customer={orders}
                    /> 
                }

                { activeTab === 'gift_cards' &&
                    <GiftCards
                        customer={customer}
                        giftBalance={rewards.giftCardBalance}
                        referralCredit={rewards.referralBalance}
                    /> 
                }

                { activeTab === 'comm' &&
                    <Communication
                        customer={customer}        
                        agreeConsent={agreeConsent}
                        receiveConsent={receiveConsent}
                        handleAgreeUpdate={(value) => setAgreeConsent(value)}      
                        handleReceiveUpdate={(value) => setReceiveConsent(value)}            
                    /> 
                }
            </section>

        </div>
    );
}