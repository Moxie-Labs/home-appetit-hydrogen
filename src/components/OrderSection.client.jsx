import { useCart } from "@shopify/hydrogen";
import { Suspense, useState } from "react"
import { Layout } from "./Layout.client";
import { LayoutSection } from "./LayoutSection.client";
import MenuSection from "./MenuSection.client";
import OrderProperties from "./OrderProperties.client";
import OrderSummary from "./OrderSummary.client";
import DeliveryWindow from "./DeliveryWindow.client";
import { Page } from "./Page.client";
import DeliveryInfo from "./DeliveryInfo.client";
import OrderConfirmation from "./OrderConfirmation.client";
import { CompleteSignUp } from "./CompleteSignup.client";
import {Header} from "./Header.client";
import {Footer} from "./Footer.client";
import DebugValues from "./DebugValues.client";
import Modal from "react-modal/lib/components/Modal";

// base configurations
const SHOW_DEBUG = import.meta.env.VITE_SHOW_DEBUG === undefined ? false : import.meta.env.VITE_SHOW_DEBUG;
const TOAST_CLEAR_TIME = 5000;
const FREE_QUANTITY_LIMIT = 4;
const FIRST_STEP = 1;
const ADD_ON_STEP = 4;
const FIRST_PAYMENT_STEP = 5;
const CONFIRMATION_STEP = 7;
const FIRST_WINDOW_START = 8;
const PLACEHOLDER_SALAD = `https://cdn.shopify.com/s/files/1/0624/5738/1080/products/mixed_greens.png?v=1646182911`;
const DEFAULT_CARDS = [
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
];

export function OrderSection(props) {

    const { id: cartId, cartCreate, checkoutUrl, status: cartStatus, linesAdd, linesRemove, linesUpdate, lines: cartLines, cartAttributesUpdate, buyerIdentityUpdate, noteUpdate } = useCart();
    
    const { customerData } = props;
    let customer = null;
    if (customerData != null) 
         customer = customerData.customer;

    let defaultAddress = null;
    if (customer != null) {
        customer.addresses.edges.map(addr => {
            if (addr.node.id === customer.defaultAddress.id)
                defaultAddress = addr.node;
        });
    }
    

    const [totalPrice, setTotalPrice] = useState(100.0)
    const [servingCount, setServingCount] = useState(0)
    const [selection, setSelections] = useState([])
    const [activeScheme, setActiveScheme] = useState('traditional')
    const [currentStep, setCurrentStep] = useState(FIRST_STEP)
    const [isGuest, setIsGuest] = useState(props.isGuest);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangePlanModalShowing, setChangePlanModalShowing] = useState(false);

    const [isAddingExtraItems, setIsAddingExtraItems] = useState(false)
    const [selectedSmallItems, setSelectedSmallItems] = useState([])
    const [selectedSmallItemsExtra, setSelectedSmallItemsExtra] = useState([])
    
    const [selectedMainItems, setSelectedMainItems] = useState([])
    const [selectedMainItemsExtra, setSelectedMainItemsExtra] = useState([])

    const [selectedAddonItems, setSelectedAddonItems] = useState([])
    const [selectedSmallFilters, setSelectedSmallFilters] = useState([])
    const [selectedMainFilters, setSelectedMainFilters] = useState([])
    const [selectedAddonFilters, setSelectedAddonFilters] = useState([])

    const [toastMessages, setToastMessages] = useState([]);
    const [showToast, setShowToast] = useState(false);

    const [deliveryWindowStart, setDeliveryWindowStart] = useState(null);
    const [deliveryWindowEnd, setDeliveryWindowEnd] = useState(FIRST_WINDOW_START + 2);
    const [deliveryWindowDay, setDeliveryWindowDay] = useState(1);

    let [firstName, setFirstName] = useState(isGuest ? null : customer.firstName);
    let [lastName, setLastName] = useState(isGuest ? null : customer.lastName);
    let [emailAddress, setEmailAddress] = useState(isGuest ? null : customer.email);
    let [phoneNumber, setPhoneNumber] = useState(isGuest ? null : customer.phone);
    let [address, setAddress] = useState(defaultAddress === null ? null : defaultAddress.address1);
    let [address2, setAddress2] = useState(defaultAddress === null ? null : defaultAddress.address2);
    let [deliveryState, setDeliveryState] = useState(defaultAddress === null ? null : defaultAddress.province);
    let [city, setCity] = useState(isGuest ? null : defaultAddress === null ? null : defaultAddress.city);
    let [zipcode, setZipcode] = useState(defaultAddress === null ? null : defaultAddress.zip);    
    let [country, setCountry] = useState("United States");

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

    const [creditCards, setCreditCards] = useState(props.guest ? [] : DEFAULT_CARDS)
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

    const doesCartHaveItem = (choice, collection) => {
        let retval = false;
        collection.map(item => {
            if (item.choice.title === choice.choice.title)
                retval = true;
        });

        return retval;
    }

    const findCartLineByVariantId = variantId => {
        let retval = null;
        cartLines.map(line => {
            if (line.merchandise.id === variantId) retval = line;
        });

        return retval;
    }

    const findCollectionItemIndex = (item, collection) => {
        let retval = -1;

        collection.map((item, index) => {
            if (item.choice.title === choice.choice.title)
                retval = index;
        });

        return retval;
    }

    const addItemToCart = (choice, collection, collectionName, addToShopifyCart=true, isIce=false) => {

        const variantType = isIce ? 0 : getVariantType(collection);        

        // if: item was already added in Traditional, then: update quantity and modifiers (or remove)
        if (doesCartHaveItem(choice, collection) && activeScheme === 'traditional') {
            console.log("addItemToCart::already exists", choice);
            const existingCartLine = findCartLineByVariantId(choice.choice.productOptions[variantType].node.id);

            collection.map((item, i) => {
                if (item.choice.title === choice.choice.title) {
                    if (choice.quantity > 0) {
                        item.quantity = choice.quantity;
                        const linesUpdatePayload = [];
                        linesUpdatePayload.push({
                            id: existingCartLine.id,
                            quantity: choice.quantity
                        });

                        const modsAdded = [];
                        choice.selectedMods.map(mod => {
                            const modCartLine = findCartLineByVariantId(mod.variants.edges[0].node.id);
                            
                            // if: mods were added after parent item was already set, then: add them separately, else: just update
                            if (modCartLine === null) 
                                modsAdded.push(mod);
                            else
                                linesUpdatePayload.push({
                                    id: modCartLine.id,
                                    quantity: choice.quantity
                                });
                        });

                        linesUpdate(linesUpdatePayload);

                        if (modsAdded.length > 0) {
                            console.log("modsAdded", modsAdded);
                            const linesAddPayload = [];
                                modsAdded.map(mod => {
                                    linesAddPayload.push({ 
                                        merchandiseId: mod.variants.edges[0].node.id,
                                        quantity: choice.quantity
                                    });
                                }); 

                            setTimeout(() => {
                                linesAdd(linesAddPayload);
                            }, 2000);
                        }
                    }
                        
                    else {
                        // handle internal Cart Collection
                        collection.splice(i, 1);

                        // update Shopify Cart
                        const linesRemovePayload = [];
                        linesRemovePayload.push(existingCartLine.id);
                        choice.selectedMods.map(mod => {
                            const modCartLine = findCartLineByVariantId(mod.variants.edges[0].node.id);
                            if (modCartLine !== null)
                                linesRemovePayload.push(modCartLine.id)
                        });
                        linesRemove(linesRemovePayload);
                    }
                        
                }
            });

            if (collectionName === 'main')
                if (isAddingExtraItems)
                    setSelectedMainItemsExtra([...selectedMainItemsExtra]);
                else
                    setSelectedMainItems([...collection]);
            else if (collectionName === 'small')
                if (isAddingExtraItems)
                    setSelectedSmallItemsExtra([...selectedSmallItemsExtra]);
                else
                    setSelectedSmallItems([...selectedSmallItems]);
            else 
                setSelectedAddonItems([...selectedAddonItems]);

        }

        // else: add item with quantity
        else if (choice.quantity > 0) {
            console.log("addItemToCart::adding new item", choice);
            

            if (collectionName === 'main') 
                if (isAddingExtraItems)
                    setSelectedMainItemsExtra([...selectedMainItemsExtra, choice]);
                else
                    setSelectedMainItems([...selectedMainItems, choice]);
            else if (collectionName === 'small')
                if (isAddingExtraItems)
                    setSelectedSmallItemsExtra([...selectedSmallItemsExtra, choice]);
                else
                    setSelectedSmallItems([...selectedSmallItems, choice]);
            else 
                setSelectedAddonItems([...selectedAddonItems, choice]);

            setToastMessages([{item: `+${choice.quantity} ${choice.choice.title}`, cost: choice.choice.price}]);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, TOAST_CLEAR_TIME);

            if (addToShopifyCart) {
                console.log("Updating Shopify cart with ", choice.choice.productOptions[variantType].node.id)
                const linesAddPayload = [];
                console.log("choice selectedMods", choice.selectedMods);
                
                let selectedModsAttr = [];
                choice.selectedMods.map(mod => {
                    selectedModsAttr.push(mod.title);
                    linesAddPayload.push({ 
                        attributes: [
                            { 
                                key: "baseItemId",
                                value: choice.choice.productOptions[variantType].node.id
                            }
                        ],
                        merchandiseId: mod.variants.edges[0].node.id,
                        quantity: choice.quantity
                    });
                }); 
                
                linesAddPayload.push({ 
                    merchandiseId: choice.choice.productOptions[variantType].node.id,
                    quantity: choice.quantity,
                    attributes: selectedModsAttr.length < 1 ? [] : [{key: "Modifier(s)", value: selectedModsAttr.join(", ")}]
                });

                console.log("linesAddPayload", linesAddPayload);

                // update Shopify Cart
                linesAdd(linesAddPayload);
            }
        }

    }

    const isSectionFilled = (collection) => {
        return getQuantityTotal(collection) >= getFreeQuantityLimit() && currentStep !== ADD_ON_STEP;
    }

    const getOrderTotal = () => {
        let total = parseFloat(getPlanPrice());
        selectedSmallItems.forEach(item => {
            item.selectedMods?.map(mod => {
                total += parseFloat(mod.priceRange.maxVariantPrice.amount * item.quantity);
            });
        });
        selectedSmallItemsExtra.forEach(item => {
            item.selectedMods?.map(mod => {
                total += parseFloat(mod.priceRange.maxVariantPrice.amount * item.quantity);
            });
            total += parseFloat(item.choice.price * item.quantity);
        });
        selectedMainItems.forEach(item => {
            item.selectedMods?.map(mod => {
                total += parseFloat(mod.priceRange.maxVariantPrice.amount * item.quantity);
            });
        });
        selectedMainItemsExtra.forEach(item => {
            item.selectedMods?.map(mod => {
                total += parseFloat(mod.priceRange.maxVariantPrice.amount * item.quantity);
            });
            total += parseFloat(item.choice.price * item.quantity);
        });
        selectedAddonItems.forEach(item => {
            item.selectedMods?.map(mod => {
                total += parseFloat(mod.priceRange.maxVariantPrice.amount * item.quantity);
            });
            total += parseFloat(item.choice.price * item.quantity);
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

    const getDayOfWeekName = dayNumber => {
        const daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        return daysOfWeek[dayNumber];
    }

    const addExtraIce = value => {
        const iceItem = ICE_ITEM;
        const iceChoice = {
            title: iceItem.title,
            attributes: [],
            price: parseFloat(iceItem.priceRange.maxVariantPrice.amount),
            description: "",
            imageURL: "",
            productOptions: iceItem.variants,
            modifications: [],
            substitutions: [],
        }
        addItemToCart({choice: iceChoice, quantity: (value ? 1 : 0), selectedMods: []}, selectedAddonItems, "addons", true, true);
        setExtraIce(value);
    }

    const attemptSubmitOrder = () => {
        const buyerIdentityObj = {
            email: emailAddress,
            phone: phoneNumber,
            deliveryAddressPreferences: [
                {
                    deliveryAddress: {
                        address1: address,
                        address2: address2,
                        city: city,
                        country: country,
                        firstName: firstName,
                        lastName: lastName,
                        phone: phoneNumber,
                        province: deliveryState,
                        zip: zipcode
                    }
                    
                }
            ]
        };
        
        if (typeof customerAccessToken !== 'undefined' && customerAccessToken !== null) { buyerIdentityObj.customerAccessToken = customerAccessToken; }

        buyerIdentityUpdate(buyerIdentityObj);

        window.location.href=`${checkoutUrl}?checkout[email]=${emailAddress}
        &checkout[shipping_address][first_name]=${firstName}
        &checkout[shipping_address][last_name]=${lastName}
        &checkout[shipping_address][address1]=${address}
        &checkout[shipping_address][address2]=${address2}
        &checkout[shipping_address][city]=${city}
        &checkout[shipping_address][province]=${deliveryState}
        &checkout[shipping_address][country]=${country}
        &checkout[shipping_address][zip]=${zipcode}`;
    }

    const emptyCart = () => {
        const linesToRemove = [];
        cartLines.map(line => {
            linesToRemove.push(line.id);
        });
        linesRemove(linesToRemove);

        setSelectedMainItems([]);
        setSelectedSmallItems([]);
        setSelectedAddonItems([]);
        setSelectedMainItemsExtra([]);
        setSelectedSmallItemsExtra([]);
    }

    const confirmPersonsCount = () => {
        linesAdd({
            merchandiseId: getSelectedPlan().id,
            quantity: 1
        });

        setCurrentStep(2);
    }

    // returns whether to use the 'Premium' or 'Included' variants when adding an item to the cart
    const getVariantType = collection => {
        if (currentStep === ADD_ON_STEP)
            return 0;
        else 
            return isAddingExtraItems ? 0 : 1;
    }


    const confirmDeliveryInfo = () => {

        while(cartStatus !== 'idle') { ; }

        const cartAttributesObj = [
            {
                key: 'Order Type',
                value: activeScheme
            },
            {
                key: 'Delivery Window',
                value: `${deliveryWindowStart} - ${deliveryWindowEnd}`
            },
            {
                key: 'Delivery Day',
                value: getDayOfWeekName(deliveryWindowDay)
            }
        ];
        
        cartAttributesUpdate(cartAttributesObj);

        if (instructions.length > 0) {
            requestCallbackRuntime(confirmNote, 1000);
        }
    }

    const confirmNote = () => {
        noteUpdate(instructions);
    }

    const requestCallbackRuntime = (callback, timeoutTime=0) => {
        setTimeout(() => {
            console.log("cartStatus", cartStatus);
            if (cartStatus !== 'idle') {
                console.log("Still waiting");
                requestCallbackRuntime(callback, timeoutTime+500);
            } else {
                console.log("Running callback");
                callback();
            }
        }, timeoutTime)
    }


    const setupNextSection = nextStep => {
        setIsAddingExtraItems(false);
        setCurrentStep(nextStep);
    }

    const findCollectionById = collectionId => {
        let retval = null;
        const { collectionsById } = props;
        collectionsById.map(collection => {
            if (collection.id === collectionId)
                retval = collection;
        });
        return retval;
    }

    const getModifications = modifications => {
        if (modifications === null)
            return [];
        else {
            const { value:modifierId } = modifications;
            const modCollection = findCollectionById(modifierId);
            if (modCollection === null)
                return [];
            const collectionProducts = [];
            modCollection.products.edges.map(edge => {
                collectionProducts.push(edge.node);
            });
            console.log("modCollection.collectionProducts", collectionProducts);
            return collectionProducts;
        }
    }

    const getSubstitutions = substitutions => {
        if (substitutions === null)
            return [];
        else {
            const { value:substitutionId } = substitutions;
            const subCollection = findCollectionById(substitutionId);
            if (subCollection === null)
                return [];
            const collectionProducts = [];
            subCollection.products.edges.map(edge => {
                collectionProducts.push(edge.node);
            });
            console.log("subCollection.collectionProducts", collectionProducts);
            return collectionProducts;
        }
        
    }

    const getFreeQuantityLimit = () => {
        if (activeScheme === 'traditional')
            return FREE_QUANTITY_LIMIT;
        else
            return FREE_QUANTITY_LIMIT * Math.max(1, servingCount);
    }

    
    const queryChangeActiveScheme = (newScheme=null) => {
        console.log("queryChangeActiveScheme");
        if (newScheme === null)
            newScheme = activeScheme === 'traditional' ? 'flexible' : 'traditional';
        if (cartLines.length) 
            setChangePlanModalShowing(true);
        else
            setActiveScheme(newScheme);
    }

    const changeActiveScheme = () => {
        const newScheme = activeScheme === 'traditional' ? 'flexible' : 'traditional';
        emptyCart();
        setActiveScheme(newScheme);
        setCurrentStep(FIRST_STEP);
        setChangePlanModalShowing(false);
    }

    const getSelectedPlan = () => {
        const selectedPlan = activeScheme === 'traditional' ? props.traditionalPlanItem.variants.edges[Math.max(0,servingCount-1)].node : props.flexiblePlanItem.variants.edges[Math.max(0,servingCount-1)].node;
        return selectedPlan;
    }

    const getPlanPrice = () => {
        const selectedPlan = getSelectedPlan();
        return parseFloat(selectedPlan.price.amount);
    }

    /* END Helpers */


    /* GraphQL Setup */

    const { collectionData, zipcodeType, zipcodeArr, entreeProducts, greensProducts, addonProducts } = props;
    const zipcodeCheck = zipcodeArr.find(e => e.includes(zipcode));

    const existingMainItems = [];
    const existingMainItemsExtra = [];
    const existingSmallItems = [];
    const existingSmallItemsExtra = [];
    const existingAddonItems = [];
    const choicesEntrees = [];

    entreeProducts.map(entree => {
        const imgURL = entree.node.images.edges[0] === undefined ? PLACEHOLDER_SALAD : entree.node.images.edges[0].node.src;
        const attributes = convertTags(entree.node.tags);
        const choice = {
            title: entree.node.title,
            attributes: attributes,
            price: parseFloat(entree.node.priceRange.maxVariantPrice.amount),
            description: entree.node.description,
            imageURL: imgURL,
            productOptions: entree.node.variants.edges,
            modifications: (entree.node.modifications === null ? [] : getModifications(entree.node.modifications)),
            substitutions: (entree.node.substitutions === null ? [] : getSubstitutions(entree.node.substitutions))
        };
        choicesEntrees.push(choice);

        // map cart items to pre-selected choices      
        cartLines.map(line => {
            entree.node.variants.edges.forEach(variant => {
                if (line.merchandise.id === variant.node.id) {

                    // if: variant is Included, then: add to MainItems, else: add to Extras
                    if (variant.node.title === "Included")
                        existingMainItems.push({choice: choice, quantity: line.quantity});
                    else
                        existingMainItemsExtra.push({choice: choice, quantity: line.quantity});
                }
            });
        });
    });

    if (existingMainItems.length > 0 && selectedMainItems.length < 1) 
        setSelectedMainItems(existingMainItems);
    if (existingMainItemsExtra.length > 0 && selectedMainItemsExtra.length < 1) 
        setSelectedMainItemsExtra(existingMainItemsExtra);

    const choicesGreens = [];
    greensProducts.map(greens => {
        const imgURL = greens.node.images.edges[0] === undefined ? PLACEHOLDER_SALAD : greens.node.images.edges[0].node.src;
        const attributes = convertTags(greens.node.tags);
        const choice = {
            title: greens.node.title,
            attributes: attributes,
            price: parseFloat(greens.node.priceRange.maxVariantPrice.amount),
            description: greens.node.description,
            imageURL: imgURL,
            productOptions: greens.node.variants.edges,
            modifications: greens.node.modifications === null ? [] : getModifications(greens.node.modifications.value),
            substitutions: greens.node.substitutions === null ? [] : getSubstitutions(greens.node.substitutions.value)
        }

        choicesGreens.push(choice);

        // map cart items to pre-selected choices        
        cartLines.map(line => {
            greens.node.variants.edges.forEach(variant => {
                if (line.merchandise.id === variant.node.id) {
                    if (variant.node.title === "Included")
                        existingSmallItems.push({choice: choice, quantity: line.quantity});
                    else
                        existingSmallItemsExtra.push({choice: choice, quantity: line.quantity});
                }
            });
        });
    });

    if (existingSmallItems.length > 0 && selectedSmallItems.length < 1) 
        setSelectedSmallItems(existingSmallItems);
    if (existingSmallItemsExtra.length > 0 && selectedSmallItemsExtra.length < 1) 
        setSelectedSmallItemsExtra(existingSmallItemsExtra);
    

    const choicesAddons = [];
    addonProducts.map(addons => {
        const imgURL = addons.node.images.edges[0] === undefined ? PLACEHOLDER_SALAD : addons.node.images.edges[0].node.src;
        const attributes = convertTags(addons.node.tags);
        const choice = {
            title: addons.node.title,
            attributes: attributes,
            price: parseFloat(addons.node.priceRange.maxVariantPrice.amount),
            description: addons.node.description,
            imageURL: imgURL,
            productOptions: addons.node.variants.edges,
            modifications: addons.node.modifications === null ? [] : getModifications(addons.node.modifications.value),
            substitutions: addons.node.substitutions === null ? [] : getSubstitutions(addons.node.substitutions.value)
        };

        choicesAddons.push(choice);

        // map cart items to pre-selected choices        
        cartLines.map(line => {
            addons.node.variants.edges.forEach(variant => {
                if (line.merchandise.id === variant.node.id) {
                    existingAddonItems.push({choice: choice, quantity: line.quantity});
                }
            });
        });
    });

    if (existingAddonItems.length > 0 && selectedAddonItems.length < 1) {
        setSelectedAddonItems(existingAddonItems);
    }

    /* END GraphQL Values */


    /* Static Values */
    const TRADITIONAL_PLAN_VARIANT_IDS = [];
    props.traditionalPlanItem.variants.edges.map(edge => {
        TRADITIONAL_PLAN_VARIANT_IDS.push(edge.node.id);
    });

    const FLEXIBLE_PLAN_VARIANT_IDS = [];
    props.flexiblePlanItem.variants.edges.map(edge => {
        FLEXIBLE_PLAN_VARIANT_IDS.push(edge.node.id);
    });

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
        "id": props.extraIceItem.variants.edges[0].node.id,
        "title": "Extra Ice",
        "description": "",
        "tags": [],
        "images": {
            "edges": []
        },
        "priceRange": {
            "minVariantPrice": {
                "amount": props.extraIceItem.variants.edges[0].node.price.amount
            },
            "maxVariantPrice": {
                "amount": props.extraIceItem.variants.edges[0].node.price.amount
            }
        },
        "variants": props.extraIceItem.variants.edges
    }

    /* END Static Values */


    return (
        <Page>
            <Suspense>
            <Header 
            isOrdering = {true}/>
                {/* Ordering Sections */}
                { getPhase(currentStep) === "ordering" && 
                <div className="order-wrapper">
                    <Layout>
                        <LayoutSection>

                        { SHOW_DEBUG && 
                            <section>
                                <button className={`btn btn-standard`} disabled={(cartLines.length < 1)} onClick={() => emptyCart()}>Empty Cart</button>
                                <DebugValues
                                    activeScheme={activeScheme}
                                    servingCount={servingCount}
                                    isAddingExtraItems={isAddingExtraItems}
                                    selectedMainItems={selectedMainItems}
                                    selectedMainItemsExtra={selectedMainItemsExtra}
                                    traditionalPlanItem={props.traditionalPlanItem}
                                    planPrice={getPlanPrice()}
                                    flexiblePlanItems={props.flexiblePlanItems}
                                    extraIceItem={props.extraIceItem}
                                    cartLines={cartLines}
                                    checkoutUrl={checkoutUrl}
                                />
                            </section> 
                        }

                            <div className="dish-card-wrapper order--properties">
                                <OrderProperties
                                    activeScheme={activeScheme}
                                    handleSchemeChange={(value) => queryChangeActiveScheme(value)}
                                    handleChange={(value) => setServingCount(value)}
                                    handleContinue={() => confirmPersonsCount()}
                                    handleCancel={() => setCurrentStep(1)}
                                    step={1}
                                    currentStep={currentStep}
                                    servingCount={servingCount}
                                />
                            </div>

                            {/* Menu Sections */}
                    
                            <div className={`dish-card-wrapper ${currentStep === 2 ? "step-active" : "dishcard--wrapper-inactive"}`}>
                                <MenuSection 
                                    step={2} 
                                    currentStep={currentStep}
                                    title="Entrées" 
                                    subheading="Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus. Id quod maxime placeat aut rerum select soluta nobis"
                                    servingCount={servingCount}
                                    choices={choicesEntrees} 
                                    collection={selectedMainItems}
                                    freeQuantityLimit={getFreeQuantityLimit()} 
                                    activeScheme={activeScheme}
                                    filterOptions={filterSmallOptions}
                                    handleFiltersUpdate={(filters) => setSelectedMainFilters(filters)}
                                    handleItemSelected={(choice) => addItemToCart(choice, selectedMainItems, 'main')}
                                    handleConfirm={() => setupNextSection(3)}
                                    handleEdit={() => setCurrentStep(2)}
                                    handleIsAddingExtraItems={(isAddingExtraItems) => setIsAddingExtraItems(isAddingExtraItems)}
                                    selected={selectedMainItems}
                                    selectedExtra={selectedMainItemsExtra}
                                    filters={selectedMainFilters}    
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                    isSectionFilled={isSectionFilled(selectedMainItems)}
                                    isAddingExtraItems={isAddingExtraItems}
                                    handleChangePlan={() => queryChangeActiveScheme()}
                                />
                            </div>
                            
                            <div className={`dish-card-wrapper ${currentStep === 3 ? "step-active" : "dishcard--wrapper-inactive"}`}>
                                <MenuSection 
                                    step={3} 
                                    currentStep={currentStep}
                                    title="Small Plates" 
                                    subheading="Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus. Id quod maxime placeat aut rerum select soluta nobis"
                                    servingCount={servingCount}
                                    choices={choicesGreens} 
                                    collection={selectedSmallItems}
                                    freeQuantityLimit={getFreeQuantityLimit()} 
                                    activeScheme={activeScheme}
                                    filterOptions={filterSmallOptions}
                                    handleFiltersUpdate={(filters) => setSelectedSmallFilters(filters)}
                                    handleItemSelected={(choice) => addItemToCart(choice, selectedSmallItems, 'small')}
                                    handleConfirm={() => setupNextSection(4)}
                                    handleEdit={() => setCurrentStep(3)}
                                    handleIsAddingExtraItems={(isAddingExtraItems) => setIsAddingExtraItems(isAddingExtraItems)}
                                    selected={selectedSmallItems}
                                    selectedExtra={selectedSmallItemsExtra}
                                    filters={selectedSmallFilters}    
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                    isSectionFilled={isSectionFilled(selectedSmallItems)}
                                    isAddingExtraItems={isAddingExtraItems}
                                    handleChangePlan={() => queryChangeActiveScheme()}
                                />
                            </div>

                            <div className={`dish-card-wrapper ${currentStep === 4 ? "step-active-final" : "dishcard--wrapper-inactive"}`}>
                                <MenuSection 
                                    step={4} 
                                    currentStep={currentStep}
                                    title="Add Ons" 
                                    subheading="Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus. Id quod maxime placeat aut rerum select soluta nobis"
                                    servingCount={servingCount}
                                    choices={choicesAddons} 
                                    collection={selectedAddonItems}
                                    freeQuantityLimit={99}
                                    activeScheme={activeScheme}
                                    filterOptions={filterSmallOptions}
                                    handleFiltersUpdate={(filters) => setSelectedAddonFilters(filters)}
                                    handleItemSelected={(choice) => addItemToCart(choice, selectedAddonItems, 'addons')}
                                    handleConfirm={() => setupNextSection(5)}
                                    handleEdit={() => setCurrentStep(4)}
                                    selected={selectedAddonItems}
                                    selectedExtra={[]}
                                    filters={selectedAddonFilters}    
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                    noQuantityLimit={true}
                                    isSectionFilled={isSectionFilled(selectedAddonItems)}
                                    isAddingExtraItems={isAddingExtraItems}
                                    handleChangePlan={() => queryChangeActiveScheme()}
                                />
                            </div>

                        </LayoutSection>

                        <LayoutSection>
                            <OrderSummary 
                                currentStep={currentStep}
                                activeScheme={activeScheme}
                                servingCount={servingCount}
                                pricingMultiplier={getPlanPrice()}
                                orderTotal={getOrderTotal()}
                                selectedMainItems={[...selectedMainItems]} 
                                selectedMainItemsExtra={[...selectedMainItemsExtra]} 
                                selectedSmallItems={[...selectedSmallItems]}
                                selectedSmallItemsExtra={[...selectedSmallItemsExtra]}
                                selectedAddonItems={[...selectedAddonItems]}
                                toastMessages={toastMessages}
                                showToast={showToast}
                                getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                freeQuantityLimit={getFreeQuantityLimit()} 
                            />  
                        </LayoutSection>

                        <Modal
                              isOpen={isChangePlanModalShowing}
                              onRequestClose={() => setChangePlanModalShowing(!isChangePlanModalShowing)}
                              className="modal--flexible-confirmaton"
                            >
                                <div className='modal--flexible-inner'>
                                    <h2 className='ha-h4'>Change order type?</h2>
                                    <h4 className='subheading'>Quis eu rhoncus, vulputate cursus esdun.</h4>
                                    <p className='ha-body'>Esit est velit lore varius vel, ornare id aliquet sit. Varius vel, ornare id aliquet sit tristique sit nisl. Amet vel sagittis null quam es. Digs nissim sit est velit lore varius vel, ornare id aliquet sit tristique sit nisl. Amet vel sagittis null quam each.</p>
                                    <section className="card__actions">
                                        <button className="btn btn-primary-small btn-counter-confirm" onClick={() => changeActiveScheme()}>Change Plan</button>
                                        <button className="btn ha-a btn-modal-cancel" onClick={() => setChangePlanModalShowing(false)}>Keep Current Plan</button>
                                    </section>   
                                </div>
                            </Modal>
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
                                deliveryWindowOne={dayOfWeek("next", "monday")}
                                deliveryWindowTwo={dayOfWeek("next", "tuesday")}
                                handleChangeStart={(value) => setDeliveryStart(value)}
                                handleChangeEnd={(value) => setDeliveryEnd(value)}
                                handleChangeDay={value => setDeliveryWindowDay(value)}
                                handleContinue={() => {setCurrentStep(6); setIsEditing(isGuest)}}
                                handleCancel={() => {setCurrentStep(5)}}
                                step={5}
                                currentStep={currentStep}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
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
                                deliveryState={deliveryState}
                                zipcode={zipcode}
                                zipcodeCheck={zipcodeCheck}
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
                                handleContinue={() => {
                                    requestCallbackRuntime(confirmDeliveryInfo);
                                    requestCallbackRuntime(attemptSubmitOrder, 2000);
                                }}
                                handleCancel={() => {setCurrentStep(5)}}
                                step={6}
                                currentStep={currentStep}
                                isGuest={isGuest}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                            />

                        </LayoutSection>

                    </Layout>

                    <Layout>
                        <LayoutSection>
                            <OrderSummary 
                                activeScheme={activeScheme}
                                servingCount={servingCount}
                                pricingMultiplier={getPlanPrice()}
                                orderTotal={getOrderTotal()}
                                selectedMainItems={[...selectedMainItems]} 
                                selectedMainItemsExtra={[...selectedMainItemsExtra]} 
                                selectedSmallItems={[...selectedSmallItems]}
                                selectedSmallItemsExtra={[...selectedSmallItemsExtra]}
                                selectedAddonItems={[...selectedAddonItems]}
                                toastMessages={toastMessages}
                                showToast={showToast}
                                getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                getPhase={getPhase(currentStep)}
                                freeQuantityLimit={getFreeQuantityLimit()} 
                                isEditing={isEditing}
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
                                    pricingMultiplier={getPlanPrice()}
                                    orderTotal={getOrderTotal()}
                                    selectedMainItems={[...selectedMainItems]} 
                                    selectedMainItemsExtra={[...selectedMainItemsExtra]} 
                                    selectedSmallItems={[...selectedSmallItems]}
                                    selectedSmallItemsExtra={[...selectedSmallItemsExtra]}
                                    selectedAddonItems={[...selectedAddonItems]}
                                    toastMessages={toastMessages}
                                    showToast={showToast}
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                    getPhase={getPhase(currentStep)}
                                    freeQuantityLimit={getFreeQuantityLimit()} 
                                />  
                            </LayoutSection>
                        </Layout>
                    </div>
                
                    <CompleteSignUp/>
            
                </div>
            }

            </Suspense>
            <Footer />
        </Page>
    );
}
