import { gql } from "@shopify/hydrogen";
import { Suspense, useState } from "react"
import { Layout } from "./Layout.client";
import { LayoutSection } from "./LayoutSection.client";
import MenuSection from "./MenuSection.client";
import OrderProperties from "./OrderProperties.client";
import OrderSummary from "./OrderSummary.client";
import DeliveryWindow from "./DeliveryWindow.client";
import { Page } from "./Page.client";
import DeliveryInfo from "./DeliveryInfo.client";
import PaymentInfo from "./PaymentInfo.client";
import OrderConfirmation from "./OrderConfirmation.client";
import { CompleteSignUp } from "./CompleteSignup.client";


// base configurations
const TOAST_CLEAR_TIME = 5000;
const FREE_QUANTITY_LIMIT = 4;
const FIRST_STEP = 1;
const ADD_ON_STEP = 4;
const FIRST_PAYMENT_STEP = 5;
const CONFIRMATION_STEP = 8;
const FIRST_WINDOW_START = 8;
const PLACEHOLDER_SALAD = `https://cdn.shopify.com/s/files/1/0624/5738/1080/products/mixed_greens.png?v=1646182911`;

export function OrderSection(props) {


    const [totalPrice, setTotalPrice] = useState(100.0)
    const [servingCount, setServingCount] = useState(1)
    const [selection, setSelections] = useState([])
    const [activeScheme, setActiveScheme] = useState('traditional')
    const [currentStep, setCurrentStep] = useState(CONFIRMATION_STEP)
    const [isGuest, setIsGuest] = useState(false);

    const [selectedSmallItems, setSelectedSmallItems] = useState([])
    const [selectedMainItems, setSelectedMainItems] = useState([])
    const [selectedAddonItems, setSelectedAddonItems] = useState([])
    const [selectedSmallFilters, setSelectedSmallFilters] = useState([])
    const [selectedMainFilters, setSelectedMainFilters] = useState([])
    const [selectedAddonFilters, setSelectedAddonFilters] = useState([])


    const [toastMessages, setToastMessages] = useState([]);
    const [showToast, setShowToast] = useState(false);

    const [deliveryWindowStart, setDeliveryWindowStart] = useState(FIRST_WINDOW_START);
    const [deliveryWindowEnd, setDeliveryWindowEnd] = useState(FIRST_WINDOW_START + 2);
    const [deliveryWindowDay, setDeliveryWindowDay] = useState(6);
    const [firstName, setFirstName] = useState("Jon Paul");
    const [lastName, setLastName] = useState("Simonelli");
    const [emailAddress, setEmailAddress] = useState("jpsimonelli@moxielabs.co");
    const [phoneNumber, setPhoneNumber] = useState("123 456 7890");
    const [address, setAddress] = useState("121 Mayberry Road");
    const [address2, setAddress2] = useState("");
    const [deliveryState, setDeliveryState] = useState("Pennsylvania");
    const [city, setCity] = useState("Catawissa");
    const [zipcode, setZipcode] = useState("17820");
    const [instructions, setInstructions] = useState("");
    const [extraIce, setExtraIce] = useState(false);
    const [isGift, setIsGift] = useState(false);
    const [giftMessage, setGiftMessage] = useState();
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [receiveTexts, setReceiveTexts] = useState(false);

    const [cardNumber, setCardNumber] = useState("");
    const [expiration, setExpiration] = useState("");
    const [securityCode, setSecurityCode] = useState("");
    const [cardZipcode, setCardZipcode] = useState("");
    const [sameAsBilling, setSameAsBilling] = useState(true);

    const [billingFirstName, setBillingFirstName] = useState("");
    const [billingLastName, setBillingLastName] = useState("");
    const [billingEmailAddress, setBillingEmailAddress] = useState("");
    const [billingPhoneNumber, setBillingPhoneNumber] = useState("");
    const [billingAddress, setBillingAddress] = useState("");
    const [billingAddress2, setBillingAddress2] = useState("");
    const [billingDeliveryState, setBillingDeliveryState] = useState("");
    const [billingCity, setBillingCity] = useState("");
    const [billingZipcode, setBillingZipcode] = useState("");

    const [creditCards, setCreditCards] = useState([
        {
            brand: "Visa",
            expiryMonth: "11",
            expiryYear: "26",
            firstDigits: 4111,
            firstName: "Jon Paul",
            lastDigits: 1111,
            lastName: "Simonelli",
            maskedNumber: "****1111"
        },
        {
            brand: "Visa",
            expiryMonth: "10",
            expiryYear: "27",
            firstDigits: 4112,
            firstName: "Jon Paul",
            lastDigits: 1112,
            lastName: "Simonelli",
            maskedNumber: "****1112"
        }
    ])
    const [giftCards, setGiftCards] = useState([]);
    const [giftCardTriggered, setGiftCardTriggered] = useState(false);
    const [promoTriggered, setPromoTriggered] = useState(false);
    const [referralTriggered, setReferralTriggered] = useState(false);

    /* Helpers */
    const convertTags = tags => {
        const newTags = [];
        tags.map(tag => {
            if (tag === 'Dairy Free')
                newTags.push('DF');
            else if (tag === 'Gluten Free')
                newTags.push('GF');
            else
                newTags.push(tag.toUpperCase());
        });
        return newTags;
    }

    let selectedMainItemsReadout = [];
    selectedMainItems.forEach(item => {
        selectedMainItemsReadout.push(item.title);
    });

    const doesCartHaveItem = (choice, collection) => {
        const retval = false;
        collection.map(item => {
            if (item.choice.title === choice.choice.title)
                retval = true;
        });

        return retval;
    }

    const addItemToCart = (choice, collection, collectionName) => {

        // if: item was already added, then: update quantity (or remove)
        if (doesCartHaveItem(choice, collection)) {
            console.log("addItemToCart::already exists", choice);
            collection.map((item, i) => {
                if (item.choice.title === choice.choice.title) {
                    if (choice.quantity > 0) 
                        item.quantity = choice.quantity;
                    else 
                        collection.splice(i, 1)
                }
            });

            if (collectionName === 'main') 
                setSelectedMainItems([...collection]);
            else if (collectionName === 'small')
                setSelectedSmallItems([...collection]);
            else 
                setSelectedAddonItems([...collection]);

        }

        // else: add item with quantity
        else if (choice.quantity > 0) {
            console.log("addItemToCart::adding new item", choice);
            if (collectionName === 'main') 
                setSelectedMainItems([...collection, choice]);
            else if (collectionName === 'small')
                setSelectedSmallItems([...collection, choice]);
            else 
                setSelectedAddonItems([...collection, choice]);

            setToastMessages([{item: `+${choice.quantity} ${choice.choice.title}`, cost: choice.choice.price}]);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, TOAST_CLEAR_TIME);

            if (getQuantityTotal([...collection, choice]) >= FREE_QUANTITY_LIMIT && currentStep !== ADD_ON_STEP) {
                setCurrentStep(currentStep+1);
            }
        }
    }

    const getOrderTotal = () => {
        let total = parseFloat(pricingMultiplier);
        selectedSmallItems.forEach((item, index) => {
            if (index >= 4)
                total += parseFloat(item.choice.price);
        });
        selectedMainItems.forEach((item, index) => {
            if (index >= 4)
                total += parseFloat(item.choice.price);
        });
        selectedAddonItems.forEach(item => {
            total += parseFloat(item.choice.price);
        });

        return total;
    }

    const getQuantityTotal = (itemGroup) => {
        let total = 0;
        if (itemGroup != null) {
            itemGroup.forEach((item) => {
                total += item.quantity;
            });
        }

        return total;
    }

    const setDeliveryStart = (event) => {
        const value = parseInt(event.target.value);
        const endValue = value + 2;
        console.log("Changing Delivery Start to", value)
        setDeliveryWindowStart(value);
        setDeliveryWindowEnd(endValue)
    }

    const setDeliveryEnd = (event) => {
        // no op
    }

    const confirmDeliveryWindow = () => {
        setCurrentStep(6);
    }

    const handleStateChange = (state) => {
        setDeliveryState(state);
    }

    const getPhase = (currentStep) => {
        if (currentStep < FIRST_PAYMENT_STEP) 
            return "ordering";
        else if (currentStep < CONFIRMATION_STEP)
            return "payment";
        else 
            return "confirmation";
    }

    const dayOfWeek = (method, day) => {
        let dow = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"],
            v1 = (new Date).getDay(),
            v2 = Number(Object.keys(dow).find((key => dow[key] === day))),
            result = 0;
        if ("last" == method) result = v2 - v1, result >= 0 && (result = v2 - 7 - v1);
        else {
            if ("next" != method) return !1;
            0 == v2 && (v2 = 7), result = v2 - v1, result < 1 && (result = v2 + 7 - v1)
        }
        new Date;
        return result < 0 ? (result *= -1, new Date((new Date).setDate((new Date).getDate() - result))) : new Date((new Date).setDate((new Date).getDate() + result))
    }

    const addExtraIce = value => {
        const iceItem = ICE_ITEM;
        const iceChoice = {
            title: iceItem.title,
            attributes: [],
            price: parseFloat(iceItem.priceRange.maxVariantPrice.amount/100),
            description: "",
            imageURL: "",
            productOptions: []
        }
        addItemToCart({choice: iceChoice, quantity: (value ? 1 : 0)}, selectedAddonItems, "addons");
        setExtraIce(value);
    }


    const attemptSubmitOrder = () => {
        createCheckout({
            variables: {
                lineItems: [{ variantId: "gid://shopify/ProductVariant/42919798276312", quantity: 1 }]
            }
        })
        // setCurrentStep(8);
    }

    /* END Helpers */


    /* GraphQL Setup */

    const {collectionData} = props;

    const collections = [];
    collectionData.collections.edges.map(collection => {
        collections[collection.node.handle] = collection.node;
    });

    const entreeProducts = collections['entrees'].products.edges;
    const greensProducts = collections["greens-grains-small-plates"].products.edges;
    const addonsProducts = collections['add-ons'].products.edges;

    const choicesEntrees = [];
    entreeProducts.map(entree => {
        const imgURL = entree.node.images.edges[0] === undefined ? PLACEHOLDER_SALAD : entree.node.images.edges[0].node.src;
        const attributes = convertTags(entree.node.tags);
        choicesEntrees.push({
            title: entree.node.title,
            attributes: attributes,
            price: parseFloat(entree.node.priceRange.maxVariantPrice.amount/100),
            description: entree.node.description,
            imageURL: imgURL,
            productOptions: []
        });
    });

    const choicesGreens = [];
    greensProducts.map(greens => {
        const imgURL = greens.node.images.edges[0] === undefined ? PLACEHOLDER_SALAD : greens.node.images.edges[0].node.src;
        const attributes = convertTags(greens.node.tags);
        choicesGreens.push({
            title: greens.node.title,
            attributes: attributes,
            price: parseFloat(greens.node.priceRange.maxVariantPrice.amount/100),
            description: greens.node.description,
            imageURL: imgURL,
            productOptions: []
        });
    });

    const choicesAddons = [];
    addonsProducts.map(addons => {
        const imgURL = addons.node.images.edges[0] === undefined ? PLACEHOLDER_SALAD : addons.node.images.edges[0].node.src;
        const attributes = convertTags(addons.node.tags);
        choicesAddons.push({
            title: addons.node.title,
            attributes: attributes,
            price: parseFloat(addons.node.priceRange.maxVariantPrice.amount/100),
            description: addons.node.description,
            imageURL: imgURL,
            productOptions: []
        });
    });

    /* END GraphQL Values */



    /* Static Values */
    const pricingMultiplier = activeScheme === 'traditional' ? `${50 * servingCount + 50}` : 'flex';

    const filterSmallOptions = [
        {label: 'All Options', value: 'ALL'},
        {label: 'Vegan', value: 'VEGAN'},
        {label: 'Gluten Free', value: 'GF'},
        {label: 'Vegetarian', value: 'VG'},
        {label: 'Dairy Free', value: 'DF'},
    ];

    const availableDeliveryStarts = [
        8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
    ];

    const availableDeliveryEnds = [
       10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
    ];

    const ICE_ITEM = {
        "id": "gid://shopify/Product/7704944312536",
        "title": "Extra Ice",
        "description": "",
        "tags": [],
        "images": {
            "edges": []
        },
        "priceRange": {
            "minVariantPrice": {
                "amount": "500.0"
            },
            "maxVariantPrice": {
                "amount": "500.0"
            }
        }
    }

    /* END Static Values */


    return (
        <Page>
            <Suspense>
                {/* Ordering Sections */}
                { getPhase(currentStep) === "ordering" && 
                <div className="order-wrapper">
                    <Layout>
                        <LayoutSection>
                            <div className="dish-card-wrapper order--properties">
                                <OrderProperties
                                    activeScheme={activeScheme}
                                    handleChange={(value) => setServingCount(value)}
                                    handleContinue={() => setCurrentStep(2)}
                                    handleCancel={() => console.log("Cancel clicked")}
                                    step={1}
                                    currentStep={currentStep}
                                />
                            </div>

                            {/* Menu Sections */}
                    
                            <div className={`dish-card-wrapper ${currentStep === 2 ? "" : "dishcard--wrapper-inactive"}`}>
                                <MenuSection 
                                    step={2} 
                                    currentStep={currentStep}
                                    title="Entrées" 
                                    subheading="Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus. Id quod maxime placeat aut rerum select soluta nobis"
                                    servingCount={servingCount}
                                    choices={choicesEntrees} 
                                    collection={selectedMainItems}
                                    freeQuantityLimit={FREE_QUANTITY_LIMIT} 
                                    filterOptions={filterSmallOptions}
                                    handleFiltersUpdate={(filters) => setSelectedMainFilters(filters)}
                                    handleItemSelected={(choice) => addItemToCart(choice, selectedMainItems, 'main')}
                                    handleConfirm={() => setCurrentStep(3)}
                                    handleEdit={() => setCurrentStep(2)}
                                    selected={selectedMainItems}
                                    filters={selectedMainFilters}    
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                />
                            </div>
                            
                            <div className={`dish-card-wrapper ${currentStep === 3 ? "" : "dishcard--wrapper-inactive"}`}>
                                <MenuSection 
                                    step={3} 
                                    currentStep={currentStep}
                                    title="Small Plates" 
                                    subheading="Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus. Id quod maxime placeat aut rerum select soluta nobis"
                                    servingCount={servingCount}
                                    choices={choicesGreens} 
                                    collection={selectedSmallItems}
                                    freeQuantityLimit={FREE_QUANTITY_LIMIT}
                                    filterOptions={filterSmallOptions}
                                    handleFiltersUpdate={(filters) => setSelectedSmallFilters(filters)}
                                    handleItemSelected={(choice) => addItemToCart(choice, selectedSmallItems, 'small')}
                                    handleConfirm={() => setCurrentStep(4)}
                                    handleEdit={() => setCurrentStep(3)}
                                    selected={selectedSmallItems}
                                    filters={selectedSmallFilters}    
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                />
                            </div>

                            <div className={`dish-card-wrapper ${currentStep === 4 ? "" : "dishcard--wrapper-inactive"}`}>
                                <MenuSection 
                                    step={4} 
                                    currentStep={currentStep}
                                    title="Add Ons" 
                                    subheading="Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus. Id quod maxime placeat aut rerum select soluta nobis"
                                    servingCount={servingCount}
                                    choices={choicesAddons} 
                                    collection={selectedAddonItems}
                                    freeQuantityLimit={99}
                                    filterOptions={filterSmallOptions}
                                    handleFiltersUpdate={(filters) => setSelectedAddonFilters(filters)}
                                    handleItemSelected={(choice) => addItemToCart(choice, selectedAddonItems, 'addons')}
                                    handleConfirm={() => setCurrentStep(5)}
                                    handleEdit={() => setCurrentStep(4)}
                                    selected={selectedAddonItems}
                                    filters={selectedAddonFilters}    
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                    noQuantityLimit={true}
                                />
                            </div>

                        </LayoutSection>

                        <LayoutSection>
                            <OrderSummary 
                                currentStep={currentStep}
                                activeScheme={activeScheme}
                                servingCount={servingCount}
                                pricingMultiplier={pricingMultiplier}
                                orderTotal={getOrderTotal()}
                                selectedMainItems={[...selectedMainItems]} 
                                selectedSmallItems={[...selectedSmallItems]}
                                selectedAddonItems={[...selectedAddonItems]}
                                toastMessages={toastMessages}
                                showToast={showToast}
                                getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                            />  
                        </LayoutSection>
                    </Layout>
                </div>
                }

{ getPhase(currentStep) === "payment" && 
                <div className="payment-wrapper">
                    <Layout>
                        <LayoutSection>

                            <DeliveryWindow 
                                availableDeliveryStarts={availableDeliveryStarts} 
                                availableDeliveryEnds={availableDeliveryEnds}
                                deliveryWindowStart={deliveryWindowStart}
                                deliveryWindowEnd={deliveryWindowEnd}
                                deliveryWindowDay={deliveryWindowDay}
                                deliveryWindowSaturday={dayOfWeek("next", "monday")}
                                deliveryWindowSunday={dayOfWeek("next", "tuesday")}
                                handleChangeStart={(value) => setDeliveryStart(value)}
                                handleChangeEnd={(value) => setDeliveryEnd(value)}
                                handleChangeDay={value => setDeliveryWindowDay(value)}
                                handleContinue={() => setCurrentStep(6)}
                                handleCancel={() => {setCurrentStep(4)}}
                                step={5}
                                currentStep={currentStep}
                            />

                        </LayoutSection>

                        <LayoutSection>

                            <DeliveryInfo
                                firstName={firstName}
                                lastName={lastName}
                                emailAddress={emailAddress}
                                phoneNumber={phoneNumber}
                                address={address}
                                address2={address2}
                                city={city}
                                zipcode={zipcode}
                                instructions={instructions}
                                extraIce={extraIce}
                                isGift={isGift}
                                giftMessage={giftMessage}
                                agreeToTerms={agreeToTerms}
                                receiveTexts={receiveTexts}
                                handleStateChange={(value) => handleStateChange(value)}
                                handleFirstNameChange={(value) => setFirstName(value)}
                                handleLastNameChange={(value) => setLastName(value)}
                                handleEmailChange={(value) => setEmailAddress(value)}
                                handlePhoneNumberChange={(value) => setPhoneNumber(value)}
                                handleAddressChange={(value) => setAddress(value)}
                                handleAddress2Change={(value) => setAddress2(value)}
                                handleCityChange={(value) => setCity(value)}
                                handleZipcodeChange={(value) => setZipcode(value)}
                                handleInstructionChange={(value) => setInstructions(value)}
                                handleExtraIce={(value) => addExtraIce(value)}
                                handleIsGift={(value) => setIsGift(value)}
                                handleGiftMessage={(value) => setGiftMessage(value)}
                                handleAgreeToTerms={value => setAgreeToTerms(value)}
                                handleReceiveTexts={value => setReceiveTexts(value)}
                                handleContinue={() => setCurrentStep(7)}
                                handleCancel={() => {setCurrentStep(5)}}
                                step={6}
                                currentStep={currentStep}
                            />

                        </LayoutSection>

                        <LayoutSection>

                            <PaymentInfo
                                isGuest={isGuest}
                                cardNumber={cardNumber}
                                expiration={expiration} 
                                securityCode={securityCode}
                                zipcode={cardZipcode}
                                firstName={billingFirstName}
                                lastName={billingLastName}
                                emailAddress={billingEmailAddress}
                                phoneNumber={billingPhoneNumber}
                                address={billingAddress}
                                address2={billingAddress2}
                                city={billingCity}
                                billingZipcode={billingZipcode}
                                sameAsBilling={sameAsBilling}
                                creditCards={creditCards}
                                giftCards={giftCards}
                                giftCardTriggered={giftCardTriggered}
                                promoTriggered={promoTriggered}
                                referralTriggered={referralTriggered}
                                handleCardNumberChange={(value) => setCardNumber(value)}
                                handleExpirationChange={(value) => setExpiration(value)}
                                handleSecurityCodeChange={(value) => setSecurityCode(value)}
                                handleZipcodeChange={(value) => setCardZipcode(value)}
                                handleSameAsBilling={(value) => setSameAsBilling(value)}
                                handleStateChange={(value) => setBillingDeliveryState(value)}
                                handleFirstNameChange={(value) => setBillingFirstName(value)}
                                handleLastNameChange={(value) => setBillingLastName(value)}
                                handleEmailChange={(value) => setBillingEmailAddress(value)}
                                handlePhoneNumberChange={(value) => setBillingPhoneNumber(value)}
                                handleAddressChange={(value) => setBillingAddress(value)}
                                handleAddress2Change={(value) => setBillingAddress2(value)}
                                handleCityChange={(value) => setBillingCity(value)}
                                handleBillingZipcodeChange={(value) => setBillingZipcode(value)}
                                handleGiftCardTrigger={() => setGiftCardTriggered(true)}
                                handlePromoTrigger={() => setPromoTriggered(!promoTriggered)}
                                handleReferralTrigger={() => setReferralTriggered(!referralTriggered)}
                                handleCreditCardsChange={(value) => setCreditCards(value)}
                                handleGiftCardsChange={(value) => setGiftCards(value)}
                                handleContinue={() => attemptSubmitOrder()}
                                handleCancel={() => {setCurrentStep(6)}}
                                step={7}
                                currentStep={currentStep}
                            />

                        </LayoutSection>
                    </Layout>

                    <Layout>
                        <LayoutSection>
                            <OrderSummary 
                                activeScheme={activeScheme}
                                servingCount={servingCount}
                                pricingMultiplier={pricingMultiplier}
                                orderTotal={getOrderTotal()}
                                selectedMainItems={[...selectedMainItems]} 
                                selectedSmallItems={[...selectedSmallItems]}
                                selectedAddonItems={[...selectedAddonItems]}
                                toastMessages={toastMessages}
                                showToast={showToast}
                                getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                getPhase={getPhase(currentStep)}
                            />  
                        </LayoutSection>
                    </Layout>
                </div>
               
            }

            { getPhase(currentStep) === "confirmation" && 
                <div>
                    <div className="payment-wrapper">
                        <Layout>
                            <LayoutSection>
                                <OrderConfirmation
                                    deliveryWindowStart={deliveryWindowStart}
                                    deliveryWindowEnd={deliveryWindowEnd}
                                    windowDay={deliveryWindowDay === 6 ? dayOfWeek("next", "saturday") : dayOfWeek("next", "sunday")}
                                    // REPLACE
                                    // cardNumber={cardNumber}
                                    cardNumber={"4111111111111111"}
                                    expiration={expiration} 
                                    securityCode={securityCode}
                                    zipcode={zipcode}
                                    firstName={firstName}
                                    lastName={lastName}
                                    emailAddress={emailAddress}
                                    phoneNumber={phoneNumber}
                                    address={address}
                                    address2={address2}
                                    city={city}
                                    orderNumber={"126YCC"}
                                    handleChangeStart={(value) => setDeliveryStart(value)}
                                    handleChangeEnd={(value) => setDeliveryEnd(value)}
                                    handleContinue={() => setCurrentStep(6)}
                                    handleCancel={() => {setCurrentStep(4)}}
                                    step={5}
                                    currentStep={currentStep}
                                />

                            </LayoutSection>
                        </Layout>
                        <Layout>
                            <LayoutSection>
                                <OrderSummary 
                                    activeScheme={activeScheme}
                                    servingCount={servingCount}
                                    pricingMultiplier={pricingMultiplier}
                                    orderTotal={getOrderTotal()}
                                    selectedMainItems={[...selectedMainItems]} 
                                    selectedSmallItems={[...selectedSmallItems]}
                                    selectedAddonItems={[...selectedAddonItems]}
                                    toastMessages={toastMessages}
                                    showToast={showToast}
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                    getPhase={getPhase(currentStep)}
                                />  
                            </LayoutSection>
                        </Layout>
                    </div>
                
                    <CompleteSignUp/>
            
                </div>
            }

            </Suspense>
        </Page>
    );
}