import { useCart, useNavigate, flattenConnection} from "@shopify/hydrogen";
import { Suspense, useEffect, useState } from "react"
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
import iconLoading from "../assets/loading-loading-forever.gif";
import { FLEXIBLE_PLAN_NAME, MAIN_ITEMS_STEP, SIDE_ITEMS_STEP, TRADITIONAL_PLAN_NAME, TOAST_CLEAR_TIME, FREE_QUANTITY_LIMIT, FIRST_STEP, ADD_ON_STEP, FIRST_PAYMENT_STEP, CONFIRMATION_STEP, FIRST_WINDOW_START, PLACEHOLDER_SALAD } from "../lib/const";

// base configurations
const SHOW_DEBUG = import.meta.env.VITE_SHOW_DEBUG === undefined ? false : import.meta.env.VITE_SHOW_DEBUG === "true";
const DEFAULT_PLAN = TRADITIONAL_PLAN_NAME;

export function OrderSection(props) {

    const { id: cartId, checkoutUrl, status: cartStatus, linesAdd, linesRemove, linesUpdate, lines: cartLines, cartAttributesUpdate, buyerIdentityUpdate, noteUpdate } = useCart();
    
    const { customerData, zoneHours } = props;
    let customer = null;
    if (customerData != null) 
         customer = customerData.customer;
         
    let addresses = [];
    let defaultAddress = null;
    if (customer != null) {
        addresses = flattenConnection(customer?.addresses) || [];
        customer.addresses.edges.map(addr => {
            if (addr.node.id === customer.defaultAddress.id)
                defaultAddress = addr.node;
        });
    }
    

    const [orderSectionKey, setOrderSectionKey] = useState(`${new Date().getTime()}`);
    const [servingCount, setServingCount] = useState(0)
    const [activeScheme, setActiveScheme] = useState(DEFAULT_PLAN)
    const [currentStep, setCurrentStep] = useState(FIRST_STEP)
    const [isGuest, setIsGuest] = useState(props.isGuest);
    const [isEditing, setIsEditing] = useState(false);
    const [isChangePlanModalShowing, setChangePlanModalShowing] = useState(false);
    const [isAlreadyOrderedModalShowing, setIsAlreadyOrderedModalShowing] = useState(false);
    const [alreadyOrderedModalDismissed, setAlreadyOrderedModalDismissed] = useState(false);
    const [isGiftCardRemoved, setIsGiftCardRemoved] = useState(false);
    const [isPromtingEmptyCart, setIsPromptingEmptyCart] = useState(false);
    const [returnToPayment, setReturnToPayment] = useState(false);

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

    let [firstName, setFirstName] = useState(isGuest ? '' : customer.firstName);
    let [lastName, setLastName] = useState(isGuest ? '' : customer.lastName);
    let [emailAddress, setEmailAddress] = useState(isGuest ? '' : customer.email);
    let [phoneNumber, setPhoneNumber] = useState(isGuest ? '' : customer.phone);
    let [address, setAddress] = useState(defaultAddress === null ? '' : defaultAddress.address1);
    let [address2, setAddress2] = useState(defaultAddress === null ? '' : defaultAddress.address2);
    let [deliveryState, setDeliveryState] = useState(defaultAddress === null ? '' : defaultAddress.province);
    let [city, setCity] = useState(defaultAddress === null ? '' : defaultAddress.city);
    let [zipcode, setZipcode] = useState(defaultAddress === null ? '' : defaultAddress.zip);    
    let [country, setCountry] = useState("United States");

    const [instructions, setInstructions] = useState("");
    const [extraIce, setExtraIce] = useState(false);
    const [isGift, setIsGift] = useState(false);
    const [giftMessage, setGiftMessage] = useState();
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [receiveTexts, setReceiveTexts] = useState(false);

    const [expiration, setExpiration] = useState("");
    const [securityCode, setSecurityCode] = useState("");

    const [userAddedItem, setUserAddedItem] = useState(false);
    const [isCollectionsLoading, setIsCollectionsLoading] = useState(true);
    const [isRestoringCart, setIsRestoringCart] = useState(false);
    const [cartWasRestored, setCartWasRestored] = useState(false);
    const [restoreCartModalDismissed, setRestoreCartModalDismissed] = useState(false);
    const [choicesEntrees, setChoicesEntrees] = useState([]);
    const [choicesGreens, setChoicesGreens] = useState([]);
    const [choicesAddons, setChoicesAddons] = useState([]);
    const [cardStatus, setCardStatus] = useState("");

    // used for deleting lineitems when multiple instances exist (Flex plan)
    const [lineIndexByVariantId, setLineIndexByVariantId] = useState([]);

    // runs necessary Storefront API calls only when needed
    useEffect(() => {
        setupCardsAndCollections();
    }, []);

    useEffect(() => {
        if (cartLines.length < 1) {
            if (props.customerAlreadyOrdered) {
                setIsAlreadyOrderedModalShowing(true);
            }
        } else {
            if (cartLines.length === 1 && isGiftCardRemoved)
                removeGiftCard();
            setIsAlreadyOrderedModalShowing(false);
            if (!userAddedItem && !restoreCartModalDismissed && cartLines.length > 0) {
                setIsRestoringCart(true);
            }   
        }
    },[cartLines])

    useEffect(() => {
        if (cartWasRestored)
            determineCurrentStep();
    }, [cartWasRestored])

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

    const findCartLineByItem = item => {
        let retval = null;
        cartLines.map(line => {
            if (line.merchandise.id === item.selectedVariantId && retval === null) {
                
                // if: item has modifiers, then find item that has same modifiers
                if (item.selectedMods?.length > 0) {
                    line.attributes.map(attr => {
                        if (attr.value === item.selectedModsStr) {
                            retval = line;
                        }
                    });
                } else {
                    retval = line;
                }
            }
        });

        return retval;
    }

    const findCartLineByVariantId = (variantId, index=0) => {
        let retval = null;
        cartLines.map(line => {
            if (line.merchandise.id === variantId) 
                if (index > 0)
                    index -= 1;
                else    
                    retval = line;
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

        if (!userAddedItem)
            setUserAddedItem(true);

        const variantType = isIce ? 0 : getVariantType(collection);        

        // if: item was already added in Traditional, then: update quantity and modifiers (or remove)
        if (doesCartHaveItem(choice, collection) && activeScheme === TRADITIONAL_PLAN_NAME) {
            console.log("addItemToCart::already exists", choice);
            console.log("collectionName: ", collectionName);
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
                        
                    else
                        removeItem(item, i, collectionName);
                        
                }
            });

            if (collectionName === 'main')
                if (isAddingExtraItems)
                    setSelectedMainItemsExtra([...selectedMainItemsExtra]);
                else
                    setSelectedMainItems([...selectedMainItems]);
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

            choice.selectedVariantId = choice.choice.productOptions[variantType].node.id;
            console.log("choice.selectedVariantId", choice.selectedVariantId);

            const lineIndex = addLineIndex(choice.choice.productOptions[variantType].node.id);
            choice.lineIndex = lineIndex;
            
            let selectedModsAttr = [];
            choice.selectedMods.map(mod => {
                selectedModsAttr.push(mod.title);
            });
            choice.selectedModsStr = selectedModsAttr.join(", ");

            if (collectionName.includes('main')) 
                if (isAddingExtraItems)
                    setSelectedMainItemsExtra([...selectedMainItemsExtra, choice]);
                else
                    setSelectedMainItems([...selectedMainItems, choice]);
            else if (collectionName.includes('sides'))
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
                
                choice.selectedMods.map(mod => {
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

    // returns what instance of a line item is being added (Flex plan only)
    const addLineIndex = variantId => {
        console.log("getLineIndex for ", variantId);
        let newLineIndex = lineIndexByVariantId;
        if (newLineIndex[variantId] === undefined || newLineIndex[variantId] === null) {
            console.log("generating new cell")
            newLineIndex[variantId] = 1;
        }
            
        else {
            console.log("Adding to existing cell");
            newLineIndex[variantId] += 1;
        }
            
        setLineIndexByVariantId(newLineIndex);
        console.log("newLineIndex", newLineIndex);
        return newLineIndex[variantId];
    }

    const shiftLineIndexes = (index, variantId, collection) => {
        collection.map(item => {
            if (item.selectedVariantId === variantId && item.lineIndex > index) 
                item.lineIndex -= 1;
        });

        let newLineIndex = lineIndexByVariantId;
        newLineIndex[variantId] -= 1;
        setLineIndexByVariantId(newLineIndex);

        return collection;
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
        &checkout[shipping_address][address2]=${address2 === null ? "" : address2}
        &checkout[shipping_address][city]=${city}
        &checkout[shipping_address][province]=${deliveryState}
        &checkout[shipping_address][country]=${country}
        &checkout[shipping_address][zip]=${zipcode}`;
    }

    const promptEmptyCart = () => {
        setIsPromptingEmptyCart(true);
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
        setIsAddingExtraItems(false);
        setCurrentStep(FIRST_STEP);
        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }

    const removeItem = (item, index, collectionName) => {
        console.log("removing Item: ", item);
        console.log("collectionName: ", collectionName);
        let linesToModify = [];
        
        // delete from internal Cart/OrderSummary
        if (collectionName === 'main') {
            let collection = selectedMainItems;
            collection.splice(index, 1);
            collection = shiftLineIndexes(item.lineIndex, item.selectedVariantId, collection);
            setSelectedMainItems([...collection]);
        } else if (collectionName === 'mainExtra') {
            let collection = selectedMainItemsExtra;
            collection.splice(index, 1);
            collection = shiftLineIndexes(item.lineIndex, item.selectedVariantId, collection);
            setSelectedMainItemsExtra([...collection]);
        } else if (collectionName === 'sides') {
            let collection = selectedSmallItems;
            collection.splice(index, 1);
            collection = shiftLineIndexes(item.lineIndex, item.selectedVariantId, collection);
            setSelectedSmallItems([...collection]);
        } else if (collectionName === 'sidesExtra') {
            let collection = selectedSmallItemsExtra;
            collection.splice(index, 1);
            collection = shiftLineIndexes(item.lineIndex, item.selectedVariantId, collection);
            setSelectedSmallItemsExtra([...collection]);
        } else if (collectionName === 'addons') {
            let collection = selectedAddonItems;
            collection.splice(index, 1);
            collection = shiftLineIndexes(item.lineIndex, item.selectedVariantId, collection);
            setSelectedAddonItems([...collection]);
        }

        // delete from Shopify Cart
        const baseLine = findCartLineByItem(item);
        if (baseLine !== null)
            linesToModify.push({
                id: baseLine.id,
                quantity: 0
            });

        cartLines.map(line => {          
            // update associated mods quantities
            item.selectedMods?.map(mod => {
                const {id:modId} = line.merchandise;
                const modVariantId = mod.variants.edges[0].node.id;
                if (modId === modVariantId) {
                    linesToModify.push({
                        id: line.id,
                        quantity: Math.max(0, (line.quantity - item.quantity))
                    });
                }
            });
        });
        
        if (linesToModify.length > 0)
            linesUpdate(linesToModify);


    }

    const confirmPersonsCount = () => {
        linesAdd({
            merchandiseId: getSelectedPlan().id,
            quantity: 1
        });

        if (!userAddedItem)
            setUserAddedItem(true);
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

        const deliveryWindows = generateDeliveryWindowDateTimes();

        const cartAttributesObj = [
            {
                key: 'Order Type',
                value: activeScheme
            },
            {
                key: 'Delivery Window Start',
                value: deliveryWindows.startDateTime
            },
            {
                key: 'Delivery Window End',
                value: deliveryWindows.endDateTime
            },
            {
                key: 'Delivery Day',
                value: deliveryWindows.deliveryDate
            }
        ];

        if (isGift) {
            cartAttributesObj.push({
                key: 'Gift?',
                value: 'Yes'
            });

            if (giftMessage.length > 0) {
                cartAttributesObj.push({
                    key: 'Gift Message',
                    value: giftMessage
                });
            }
            
        }
        
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
        // setIsAddingExtraItems(false);
        if (returnToPayment)
            updateCurrentStep(FIRST_PAYMENT_STEP)
        else
            updateCurrentStep(nextStep); 
        const step = document.querySelector(".step-active");
        step.scrollIntoView({behavior: "smooth", block: "start"});
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
        if (activeScheme === TRADITIONAL_PLAN_NAME)
            return FREE_QUANTITY_LIMIT;
        else
            return FREE_QUANTITY_LIMIT * Math.max(1, servingCount);
    }

    
    const queryChangeActiveScheme = (newScheme=null) => {
        console.log("queryChangeActiveScheme");
        if (newScheme === null)
            newScheme = activeScheme === TRADITIONAL_PLAN_NAME ? FLEXIBLE_PLAN_NAME : TRADITIONAL_PLAN_NAME;
        if (cartLines.length) 
            setChangePlanModalShowing(true);
        else
            changeActiveScheme(newScheme);
    }

    const changeActiveScheme = () => {
        const newScheme = activeScheme === TRADITIONAL_PLAN_NAME ? FLEXIBLE_PLAN_NAME : TRADITIONAL_PLAN_NAME;
        const newServingCount = newScheme === FLEXIBLE_PLAN_NAME && servingCount < 2 ? 0 : servingCount;
        emptyCart();
        setActiveScheme(newScheme);
        setCurrentStep(FIRST_STEP);
        setServingCount(newServingCount);
        setChangePlanModalShowing(false);
        setCardStatus("");
    }
    
    const getSelectedPlan = () => {
        const selectedPlan = activeScheme === TRADITIONAL_PLAN_NAME ? props.traditionalPlanItem.variants.edges[Math.max(0,servingCount-1)].node : props.flexiblePlanItem.variants.edges[Math.max(0,servingCount-1)].node;
        return selectedPlan;
    }

    const getPlanPrice = () => {
        const selectedPlan = getSelectedPlan();
        return parseFloat(selectedPlan.price.amount);
    }

    const generateDeliveryWindowDateTimes = () => {
        const dayOfWeekName = getDayOfWeekName(deliveryWindowDay).toLowerCase();
        const deliveryWindowDateTime = dayOfWeek("next", dayOfWeekName);
        const deliveryWindowStartDateTime = new Date(deliveryWindowDateTime.getTime());
        const deliveryWindowEndDateTime = new Date (deliveryWindowDateTime.getTime());
        const startMinutes = deliveryWindowStart == Math.floor(deliveryWindowStart) ? 0 : 30;
        const endMinutes = deliveryWindowEnd == Math.floor(deliveryWindowEnd) ? 0 : 30;
        deliveryWindowStartDateTime.setHours(deliveryWindowStart, startMinutes, 0);
        deliveryWindowEndDateTime.setHours(deliveryWindowEnd, endMinutes, 0);

        const startDTString = `${(addLeadingZero(deliveryWindowStartDateTime.getMonth()+1))}/${addLeadingZero(deliveryWindowStartDateTime.getDate())}/${deliveryWindowStartDateTime.getFullYear()} ${addLeadingZero(deliveryWindowStartDateTime.getHours())}:${addLeadingZero(deliveryWindowStartDateTime.getMinutes())}`;
        const endDTString = `${(addLeadingZero(deliveryWindowEndDateTime.getMonth()+1))}/${addLeadingZero(deliveryWindowEndDateTime.getDate())}/${deliveryWindowEndDateTime.getFullYear()} ${addLeadingZero(deliveryWindowEndDateTime.getHours())}:${addLeadingZero(deliveryWindowEndDateTime.getMinutes())}`;

        return { 
            deliveryDate: `${(addLeadingZero(deliveryWindowStartDateTime.getMonth()+1))}/${addLeadingZero(deliveryWindowStartDateTime.getDate())}/${addLeadingZero(deliveryWindowStartDateTime.getFullYear())}`, 
            startDateTime: startDTString, 
            endDateTime: endDTString
        };
    }

    const addLeadingZero = number => {
        if (number < 10)
            number = '0' + number;

        return number;
    }

    const resetOrder = () => {
        emptyCart();
        setCurrentStep(1);
    }

    const { zipcodeArr, entreeProducts, greensProducts, addonProducts, customerAlreadyOrdered, latestMenu } = props;
    const zipcodeCheck = zipcodeArr.find(e => e.includes(zipcode));

    const setupCardsAndCollections = () => {
        const newChoicesEntrees = [];
        const newChoicesGreens = [];
        const newChoicesAddons = [];

        entreeProducts.map(entree => {
            const imgURL = entree.node.images.edges[0] === undefined ? PLACEHOLDER_SALAD : entree.node.images.edges[0].node.src;
            const attributes = convertTags(entree.node.tags);
            const choice = {
                title: entree.node.title,
                attributes: attributes,
                price: parseFloat(entree.node.priceRange.maxVariantPrice.amount),
                description: entree.node.description,
                totalInventory: entree.node.totalInventory,
                imageURL: imgURL,
                productOptions: entree.node.variants.edges,
                modifications: (entree.node.modifications === null ? [] : getModifications(entree.node.modifications)),
                substitutions: (entree.node.substitutions === null ? [] : getSubstitutions(entree.node.substitutions)),
                baseCollection: 'main'
            };
            newChoicesEntrees.push(choice);
        });

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
                substitutions: greens.node.substitutions === null ? [] : getSubstitutions(greens.node.substitutions.value),
                baseCollection: 'sides'
            }

            newChoicesGreens.push(choice);
        });
    
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
                substitutions: addons.node.substitutions === null ? [] : getSubstitutions(addons.node.substitutions.value),
                baseCollection: 'addons'
            };

            newChoicesAddons.push(choice);
        });

        setChoicesEntrees(newChoicesEntrees);
        setChoicesGreens(newChoicesGreens);
        setChoicesAddons(newChoicesAddons);
        setIsCollectionsLoading(false);
    }

    const restoreCart = () => {
        const existingMainItems = [];
        const existingMainItemsExtra = [];
        const existingSmallItems = [];
        const existingSmallItemsExtra = [];
        const existingAddonItems = [];

        entreeProducts.map(entree => {
            // map cart items to pre-selected choices      
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
                substitutions: (entree.node.substitutions === null ? [] : getSubstitutions(entree.node.substitutions)),
                baseCollection: 'main'
            };

            cartLines.map(line => {
                entree.node.variants.edges.forEach(variant => {
                    if (line.merchandise.id === variant.node.id) {
                        const item = {};
                        item.selectedVariantId = line.merchandise.id;
                        item.choice = choice;
                        item.quantity = line.quantity;

                        // if: variant is Included, then: add to MainItems, else: add to Extras
                        if (variant.node.title === "Included")
                            existingMainItems.push(item);
                        else
                            existingMainItemsExtra.push(item);
                    }
                });
            });
        });

        if (existingMainItems.length > 0 && selectedMainItems.length < 1) 
            setSelectedMainItems(existingMainItems);
        if (existingMainItemsExtra.length > 0 && selectedMainItemsExtra.length < 1) 
            setSelectedMainItemsExtra(existingMainItemsExtra);

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
                substitutions: greens.node.substitutions === null ? [] : getSubstitutions(greens.node.substitutions.value),
                baseCollection: 'sides'
            }

            cartLines.map(line => {
                greens.node.variants.edges.forEach(variant => {
                    if (line.merchandise.id === variant.node.id) {
                        const item = {};
                        item.selectedVariantId = line.merchandise.id;
                        item.choice = choice;
                        item.quantity = line.quantity;

                        if (variant.node.title === "Included")
                            existingSmallItems.push(item);
                        else
                            existingSmallItemsExtra.push(item);
                    }
                });
            });
        });

        if (existingSmallItems.length > 0 && selectedSmallItems.length < 1) 
            setSelectedSmallItems(existingSmallItems);
        if (existingSmallItemsExtra.length > 0 && selectedSmallItemsExtra.length < 1) 
            setSelectedSmallItemsExtra(existingSmallItemsExtra);


        addonProducts.map(addons => {
            // map cart items to pre-selected choices  
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
                substitutions: addons.node.substitutions === null ? [] : getSubstitutions(addons.node.substitutions.value),
                baseCollection: 'addons'
            };

            cartLines.map(line => {
                addons.node.variants.edges.forEach(variant => {
                    const item = {};
                    item.selectedVariantId = line.merchandise.id;
                    item.choice = choice;
                    item.quantity = line.quantity;
                    if (line.merchandise.id === variant.node.id) {
                        existingAddonItems.push(item);
                    }
                });
            });
        });

        if (existingAddonItems.length > 0 && selectedAddonItems.length < 1) {
            setSelectedAddonItems(existingAddonItems);
        }

        setCartWasRestored(true);
        setIsRestoringCart(false);
    }

    const determineCurrentStep = () => {
        let newCurrentStep = 1;

        if (selectedAddonItems.length > 0)
            newCurrentStep = 4;
        else if (selectedSmallItems.length > 0)
            newCurrentStep = 3;
        else if (selectedMainItems.length > 0)
            newCurrentStep = 2;
        
        if (newCurrentStep !== currentStep)
            updateCurrentStep(newCurrentStep);

    }

    const updateCurrentStep = step => {
        let isAddingExtra = false;

        // if: Customer already picked 
        if (step === MAIN_ITEMS_STEP && getQuantityTotal(selectedMainItems) >= getFreeQuantityLimit())
            isAddingExtra = true;
        else if (step === SIDE_ITEMS_STEP && getQuantityTotal(selectedSmallItems) >= getFreeQuantityLimit())
            isAddingExtra = true;

        setCurrentStep(step);
        setIsAddingExtraItems(isAddingExtra);

        if (step >= FIRST_PAYMENT_STEP && !returnToPayment)
            setReturnToPayment(true);
    }

    const removeGiftCard = () => {
        const linesToRemove = [];
        cartLines.map(line => {
            if (line.merchandise.product.title.includes("Gift Card"))
                linesToRemove.push(line.id);
        });
        setTimeout(() => {
            linesRemove(linesToRemove);
            setIsGiftCardRemoved(true);
        }, 2000);
    }

    // Autocomplete functionality for Delivery Info section

    const handlePlaceSelect = () => {
        let addressObject = autocomplete.getPlace()
        let address = addressObject.address_components;
        setAddress(`${address[0].long_name} ${address[1].long_name}`);
        address.map(item => {
            if(item.types[0] === 'locality')
            setCity(item.long_name);
            if(item.types[0] === 'administrative_area_level_1')
            setDeliveryState(item.long_name);
            if(item.types[0] === 'postal_code')
            setZipcode(item.long_name);
        })
    }

    let autocomplete;

    const autocompleteFunc = () => {
        autocomplete = new google.maps.places.Autocomplete(document.getElementById('autocomplete'), {})
        autocomplete.addListener("place_changed", handlePlaceSelect);
    };

    /* END Helpers */

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

    if (latestMenu === null)
        {
            const navigate = useNavigate();
            navigate(`https://${import.meta.env.VITE_STORE_DOMAIN}/pages/order-now`);
        }

    else if (latestMenu !== null && isCollectionsLoading)
        return <Page>
            <Suspense>
                <div className="loading-icon-container">
                    <img src={iconLoading} width="50"/>
                </div>
            </Suspense>
        </Page>;

    else return (
        <Page>
            <Suspense>
            <Header 
            isOrdering = {true}/>
                {/* Ordering Sections */}
                { getPhase(currentStep) === "ordering" && 
                <div key={orderSectionKey} className="order-wrapper">
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
                                    currentStep={currentStep}
                                    cartId={cartId}
                                    userAddedItem={userAddedItem}
                                />
                            </section> 
                        }

                            <div className={`dish-card-wrapper order--properties ${currentStep === 1 ? "" : "dishcard--wrapper-inactive"}`}>
                                <OrderProperties
                                    activeScheme={activeScheme}
                                    handleSchemeChange={(value) => queryChangeActiveScheme(value)}
                                    handleChange={(value) => setServingCount(value)}
                                    handleContinue={() => confirmPersonsCount()}
                                    handleCancel={() => setCurrentStep(1)}
                                    planPrice={getPlanPrice()}
                                    step={1}
                                    currentStep={currentStep}
                                    servingCount={servingCount}
                                    deliveryWindowOne={dayOfWeek("next", "monday")}
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
                                    handleItemSelected={isAddingExtraItems ? 
                                        (choice) => addItemToCart(choice, selectedMainItemsExtra, 'mainExtra')
                                        :
                                        (choice) => addItemToCart(choice, selectedMainItems, 'main')}
                                    handleConfirm={() => setupNextSection(3)}
                                    handleEdit={() => updateCurrentStep(2)}
                                    handleIsAddingExtraItems={(isAddingExtraItems) => setIsAddingExtraItems(isAddingExtraItems)}
                                    selected={selectedMainItems}
                                    selectedExtra={selectedMainItemsExtra}
                                    filters={selectedMainFilters}    
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                    isSectionFilled={isSectionFilled(selectedMainItems)}
                                    isAddingExtraItems={isAddingExtraItems}
                                    handleChangePlan={() => queryChangeActiveScheme()}
                                    isRestoringCart={isRestoringCart}
                                    cardStatus={cardStatus}
                                    setCardStatus={setCardStatus}
                                    returnToPayment={returnToPayment}
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
                                    handleItemSelected={isAddingExtraItems ? 
                                        (choice) => addItemToCart(choice, selectedSmallItemsExtra, 'sidesExtra')
                                        :
                                        (choice) => addItemToCart(choice, selectedSmallItems, 'sides')}
                                    handleConfirm={() => setupNextSection(4)}
                                    handleEdit={() => updateCurrentStep(3)}
                                    handleIsAddingExtraItems={(isAddingExtraItems) => setIsAddingExtraItems(isAddingExtraItems)}
                                    selected={selectedSmallItems}
                                    selectedExtra={selectedSmallItemsExtra}
                                    filters={selectedSmallFilters}    
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                    isSectionFilled={isSectionFilled(selectedSmallItems)}
                                    isAddingExtraItems={isAddingExtraItems}
                                    handleChangePlan={() => queryChangeActiveScheme()}
                                    isRestoringCart={isRestoringCart}
                                    cardStatus={cardStatus}
                                    setCardStatus={setCardStatus}
                                    returnToPayment={returnToPayment}
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
                                    handleEdit={() => updateCurrentStep(4)}
                                    selected={selectedAddonItems}
                                    selectedExtra={[]}
                                    filters={selectedAddonFilters}    
                                    getQuantityTotal={(itemGroup) => getQuantityTotal(itemGroup)}
                                    noQuantityLimit={true}
                                    isSectionFilled={isSectionFilled(selectedAddonItems)}
                                    isAddingExtraItems={isAddingExtraItems}
                                    handleChangePlan={() => queryChangeActiveScheme()}
                                    isRestoringCart={isRestoringCart}
                                    cardStatus={cardStatus}
                                    setCardStatus={setCardStatus}
                                    returnToPayment={returnToPayment}
                                />
                            </div>
                            <section className={`menu-section__actions actions--submit-order`}>
                                <button className='btn btn-primary-small btn-app btn-disabled'>Place Order</button>
                            </section>

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
                                removeItem={(item, index, collectionName) => removeItem(item, index, collectionName)}
                                isAddingExtraItems={isAddingExtraItems}
                                emptyCart={()=>promptEmptyCart()}
                                handleChangeCurrentStep={step => updateCurrentStep(step)}                             
                                cardStatus={cardStatus}
                                cartLinesLength={cartLines === undefined ? 0 : cartLines.length}
                            />  
                        </LayoutSection>

                        <Modal
                            isOpen={isAlreadyOrderedModalShowing && !alreadyOrderedModalDismissed}
                            className="modal--flexible-confirmaton"
                        >
                            <div className='modal--flexible-inner'>
                                <h2 className='ha-h4'>Continue with New Order?</h2>
                                <p className='ha-body'>It looks like you already placed an order for this week.  You can view your existing order or continue placing a new one.</p>
                                <p>If you have any issues with your current order, please <a href="#">contact us</a></p>
                                <section className="card__actions">
                                    <button className="btn btn-primary-small btn-counter-confirm" onClick={() => {window.location.href = '/account#orders'}}>View Existing Order</button>
                                    <button className="btn ha-a btn-modal-cancel" onClick={() => setAlreadyOrderedModalDismissed(true)}>Start New Order</button>
                                </section>   
                            </div>
                        </Modal>

                        <Modal
                            isOpen={isChangePlanModalShowing}
                            onRequestClose={() => setChangePlanModalShowing(!isChangePlanModalShowing)}
                            className="modal--flexible-confirmaton modal--change-type"
                        >
                            <div className='modal--flexible-inner'>
                                <h2 className='ha-h4 text-center'>Change order type?</h2>
                                {/* <h4 className='subheading'>Quis eu rhoncus, vulputate cursus esdun.</h4> */}
                                <p className='ha-body'>Our Flex ordering option allows you to choose and modify individual dishes. Note: This ordering type does increase the base cost. Previous selections will be removed from your cart. </p>
                                <section className="card__actions">
                                    <button className="btn btn-primary-small btn-counter-confirm" onClick={() => changeActiveScheme()}>{activeScheme === TRADITIONAL_PLAN_NAME ? "Switch to flexible order" : "Switch to classic order"}</button>
                                    <button className="btn ha-a btn-modal-cancel" onClick={() => setChangePlanModalShowing(false)}>Cancel</button>
                                </section>   
                            </div>
                        </Modal>

                        <Modal
                            isOpen={isRestoringCart && !restoreCartModalDismissed}
                            className="modal--flexible-confirmaton modal--restore-cart"
                        >
                            <div className='modal--flexible-inner'>
                                <h2 className='ha-h4 text-center'>Continue with <br/> new order?</h2>
                                <p className='ha-body'>It looks like you already placed an order for this week. You can view your existing order or contine placing a new one.</p>
                                <p className='ha-body'>If you have any issues with your current order, please <a href="https://marketingbeta.homeappetitphilly.com/pages/contact-1">contact us.</a></p>
                                <section className="card__actions">
                                    <button className="btn btn-primary-small btn-counter-confirm" onClick={() => {
                                        setRestoreCartModalDismissed(true);
                                        restoreCart();
                                    }}>View existing order</button>
                                    <button className="btn ha-a btn-modal-cancel" onClick={() => {
                                        setRestoreCartModalDismissed(true);
                                        resetOrder();
                                        setIsRestoringCart(false);
                                    }}>Start new order</button>
                                </section>   
                            </div>
                        </Modal>

                        <Modal
                            isOpen={isPromtingEmptyCart}
                            onRequestClose={() => setIsPromptingEmptyCart(false)}
                            className="modal--flexible-confirmaton modal--restore-cart"
                        >
                            <div className='modal--flexible-inner'>
                                <h2 className='ha-h4 text-center'>Continue with <br/> clearing your cart?</h2>
                                <p className='ha-body'>Do you want to continue clearing your cart? This will remove all added items, and you will have to start your order from the beginning.</p>
                                <section className="card__actions">
                                    <button className="btn btn-primary-small btn-counter-confirm" onClick={() => {
                                        setIsPromptingEmptyCart(false);
                                        emptyCart();
                                    }}>Continue</button>
                                    <button className="btn ha-a btn-modal-cancel" onClick={() => {
                                        setIsPromptingEmptyCart(false);
                                    }}>Cancel</button>
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
                                availableDeliveryStarts={zoneHours} 
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
                                autocompleteFunc={autocompleteFunc}
                                addresses={addresses}
                            />

                        </LayoutSection>

                    </Layout>

                    <Layout>
                        <LayoutSection>
                            <OrderSummary 
                                activeScheme={activeScheme}
                                currentStep={currentStep}
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
                                handleChangeCurrentStep={step => updateCurrentStep(step)}
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
