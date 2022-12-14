import React from 'react';
import iconEdit from "../assets/icon-edit.png";
import iconPlus from "../assets/icon-plus-alt.png";
import iconArrowRight from "../assets/arrow-right.png"
import { Frame } from './Frame.client';
import { LayoutSection } from './LayoutSection.client';
import { Layout } from './Layout.client';
import CardFilters from './CardFilters.client';
import Modal from 'react-modal/lib/components/Modal';
import { prepModSubTitles } from '../lib/utils';
import DishCard from './DishCard.client';
import { TRADITIONAL_PLAN_NAME, FLEXIBLE_PLAN_NAME } from '../lib/const';
import { logToConsole } from '../helpers/logger';
import accordionOpen from "../assets/accordion-open.png";
import accordionCollapse from "../assets/accordion-collapse.png";

export default class MenuSection extends React.Component {

    constructor(props) {  
        super(props);
        this.state = {
            showingExtra: false,
            modalDismissed: false,
            dismissedUnderScheme: null   // stamped when Modal dismissed under current Scheme; used when activeScheme is switch after Modal is dismissed
        }
    }

    getChoicesByFilters(filters, choices) {
        const retval = [];
        
        for (let choice of choices) {
            for(let filter of filters) {
                if (!choice.attributes.includes(filter)) {
                    break;
                }
                if (choice.attributes.includes(filter)) {
                    if (filter === filters[filters.length-1]) {
                        retval.push(choice);
                    }
                }
            }
        }
        return retval;
    }

    filterChoices() {
        const {choices, filters} = this.props;
        let retval;
        if (filters.length < 1) {
            retval = choices;
        }
        else {
            retval = this.getChoicesByFilters(filters, choices);
        }
        return retval;
    }

    toggleFilter(filter) {
        let {filters} = this.props;

        if (filters.includes(filter)) {
            logToConsole("Removing filter", filter)
            const index = filters.indexOf(filter);
            filters.splice(index, 1);
        } else {
            if (filter === 'ALL') {
                filters = filters.splice(0, filter.length);
            } else {
                logToConsole("Adding filter", filter);
                filters.push(filter);
            }
        }
        this.setState(filters);
        logToConsole("filters", filters);
    }

    isFilterSelected(filter) {
        const {filters} = this.props;
        if (filter === 'ALL') {
            return (filters.length < 1);
        } else {
            const {filters} = this.props;
            return filters.includes(filter);
        }
    }

    progressBarStatus(getQuantityTotal){
        const progressPercentage = Math.max(0, parseFloat(getQuantityTotal) / parseFloat(this.props.freeQuantityLimit));

        const progressBarSlots = [];
        for(let i=0; i<this.props.freeQuantityLimit; i++) {
            progressBarSlots.push(<div key={`progress-bar--${i}`} className={`progress-bar__order-item`}></div>);
        }

        return (
            <div className="progress-bar">
                <div className={`progress-meter${progressPercentage >= 1.0 ? ' progress-meter--filled' : ''}`} style={{width: `${progressPercentage*100}%`}}></div>
                {progressBarSlots}
            </div>
        );
    }

    getExistingQuantity(choice) {
        const { selected, selectedExtra, activeScheme, isAddingExtraItems} = this.props;
        let existingQuantity = 0;

        const activeCollection = isAddingExtraItems ? [...selectedExtra] : [...selected];
    
        activeCollection.map(item => {
            if (existingQuantity === 0 && activeScheme === TRADITIONAL_PLAN_NAME) {
                if (item.choice.title === choice.title)
                    existingQuantity = item.quantity;
            }
            else if (item.choice.title === choice.title)
                    existingQuantity += item.quantity;
                
                
        });

        return parseInt(existingQuantity);
    }

    showSectionExtras() {
        this.setState({showingExtra: true, dismissedUnderScheme: this.props.activeScheme});
        this.props.handleIsAddingExtraItems(true);
    }

    skipSectionExtras() {
        this.props.handleConfirm();
        this.props.handleIsAddingExtraItems(false);
        this.dismissModal();
    }

    isInSelection(selection, choice) {
        let retval = false;

        if (typeof selection === 'undefined') return false;

        selection.map(item => {
            if (item.choice.title === choice.title)
                retval = true; 
        });

        return retval;
    }

    dismissModal() {
        const {activeScheme} = this.props;

        this.setState({
            showingModal: false,
            dismissedUnderScheme: activeScheme
        });
    }

    render() { 

        const {step, currentStep, title, subheading, freeQuantityLimit, selected, selectedExtra, collection, filters, filterOptions, handleFiltersUpdate, handleConfirm, handleEdit, servingCount, choices, handleItemSelected, getQuantityTotal, noQuantityLimit, isSectionFilled, isAddingExtraItems, handleIsAddingExtraItems, handleChangePlan, activeScheme, isRestoringCart, cardStatus, setCardStatus, returnToPayment, sectionCollapsed, handleAccordion } = this.props;
        const {dismissedUnderScheme} = this.state;
        const filteredChoices = this.filterChoices(selected);

        const mainSelected = selected;
        const extraSelected = selectedExtra;

        let filteredChoicesSection;
        if (filteredChoices.length > 0) {
            filteredChoicesSection = filteredChoices.map(choice => {

                const initialQuantity = this.getExistingQuantity(choice);

                return (
                    <div className="dish-card-item" key={choice.title}>
                        <DishCard 
                            key={`dishcard--${choice.title}`}
                            choice={choice}
                            cardStatus={cardStatus}
                            setCardStatus={setCardStatus}
                            freeQuantityLimit={freeQuantityLimit} 
                            servingCount={servingCount}
                            handleSelected={handleItemSelected}
                            initialQuantity={initialQuantity}
                            confirmed={this.getExistingQuantity(choice) > 0}
                            maxQuantity={isAddingExtraItems ? 50 : (freeQuantityLimit - getQuantityTotal(selected))}
                            showingExtra={isAddingExtraItems}
                            quantityTotal={getQuantityTotal(selected)}
                            // disables if returning to regular selection and item is not already selected
                            forceHidePrice={false}
                            // forceHidePrice={(isAddingExtraItems && this.isInSelection(mainSelected, choice))}
                            forceDisable={
                                (isSectionFilled && initialQuantity < 1 && !isAddingExtraItems)
                            }
                            // forceDisable={
                            //     ( 
                            //         (!isAddingExtraItems && (isSectionFilled || this.isInSelection(extraSelected, choice)) && !this.isInSelection(mainSelected, choice) ) || 
                            //         (isAddingExtraItems && this.isInSelection(mainSelected, choice))
                            //     )
                            // }
                            // forceDisable={false}
                            handleChangePlan={handleChangePlan}
                            activeScheme={activeScheme}
                        />
                    </div>
                )
            });
        } else {
            filteredChoicesSection = <section>
               <h2>No Items Match Your Current Filters</h2>
            </section>
        }

        const optionCounts = [];
        
        filterOptions.forEach(filter => {
            optionCounts[filter.label] = this.getChoicesByFilters([filter.value], filteredChoices).length;
        });

        const quantityLimitText = freeQuantityLimit < 99 ? `/${freeQuantityLimit}` : ``;

        // Render Sections
        const overviewSection = <section>
        <h2 sectioned="true" className="heading order_prop__heading ha-h3">Step {step}: {title}</h2>
        { (selected.length + selectedExtra.length) !== 0 && 
        <div className="suborder--summary-container">

            <div className={`suborder--summary-details summary-container ${isAddingExtraItems ? 'inactive' : 'active'}`}>
                
                <h4 className="ha-h4">{Math.min(getQuantityTotal(selected), freeQuantityLimit)}{quantityLimitText} SELECTED &nbsp; { ((currentStep === step && isAddingExtraItems) || currentStep > step)  && this.props.cardStatus !== " disabled" && <span><img onClick={() => handleIsAddingExtraItems(false)} src={iconEdit} className="icon-edit" width="65"/></span> }</h4>
                
                { !sectionCollapsed && mainSelected.map((item, index) => {
                    return ( 
                        <ul key={`unordered-list--${item.choice.title}`} className="step--order-summary">
                            <li key={`list-item--${item.choice.title}`}>({item.quantity}) {item.choice.title} <span>{item.choice.description}</span>
                                {item.selectedMods?.map(mod => {
                                    return <li><span>??? {prepModSubTitles(mod.title)}</span></li>
                                })}
                            </li>
                        </ul>
                    )
                }) }
            </div>
            
            { (isSectionFilled || selectedExtra.length > 0) &&
                <div className={`suborder--summary-additional summary-container ${isAddingExtraItems ? 'active' : 'inactive'}`}>
                    <div className="summary--additional-wrapper">
                        <h4 className="ha-h4">{extraSelected.length} Additional {title} &nbsp; { ((currentStep === step && !isAddingExtraItems) || currentStep > step) && this.props.cardStatus !== " disabled" && <span><img onClick={() => handleIsAddingExtraItems(true)} src={iconEdit} className="icon-edit" width="65"/></span> }</h4>
                        { !sectionCollapsed && extraSelected.map((item, index) => {
                            return ( 
                                <ul  key={`unordered-list--${item.choice.title}`} className="step--order-summary">
                                   <li key={item.choice.title}>({item.quantity}) {item.choice.title} <span>{item.choice.description}</span>
                                        {item.selectedMods?.map(mod => {
                                            return <li><span>??? {prepModSubTitles(mod.title)}</span></li>
                                        })}
                                    </li>
                                </ul>
                            )
                        })}
                    </div>
                </div> 
            } 

        </div>
        }
    </section>;

    const dishSection = <section className={`step-section ha-color-bg-body`}>   
        <LayoutSection>
        
            { !isSectionFilled && 
                <div>
                    <h2 sectioned="true" className="heading order_prop__heading ha-h3">Step {step}: Select <span className='desktop-only'>your</span> {title}</h2>
                    
                    {activeScheme === TRADITIONAL_PLAN_NAME && currentStep === 2 &&
                       <p className="subheading order_prop__subheading p-subheading-width">Choose four entr??es???in any combination. Have allergen concerns? Dish customizations are available. Have additional questions? Click here to contact us now.
                       </p>
                    }

                    {activeScheme === FLEXIBLE_PLAN_NAME && currentStep === 2 &&
                       <p className="subheading order_prop__subheading p-subheading-width">Choose four entr??es for each person you???re serving. Have allergen concerns? Dish customizations are available. Have additional questions? Click here to contact us now.
                       </p>
                    } 

                    {activeScheme === TRADITIONAL_PLAN_NAME && currentStep === 3 &&
                       <p className="subheading order_prop__subheading p-subheading-width">Choose four small plates???in any combination. Have allergen concerns? Dish customizations are available. Have additional questions? Click here to contact us now.

                       </p>
                    }

                    {activeScheme === FLEXIBLE_PLAN_NAME && currentStep === 3 &&
                       <p className="subheading order_prop__subheading p-subheading-width">Choose four small plates for each person you???re serving. Have allergen concerns? Dish customizations are available. Have additional questions? Click here to contact us now.

                       </p>
                    } 

                    {currentStep === 4 &&
                       <p className="subheading order_prop__subheading p-subheading-width">Breakfasts, lunch salads, dishes from our partners, and more! All items priced ala cart and are single portions unless otherwise noted.
                       </p>
                    }
                    
                    { !noQuantityLimit && <h4 className="ha-h4 quantity-indicator">{getQuantityTotal(selected)}/{freeQuantityLimit} SELECTED &nbsp; { currentStep !== step && <span><img src={iconEdit} className="icon-edit" width="65" /></span>}</h4>}
                    { noQuantityLimit && <h4 className="ha-h4 quantity-indicator">{getQuantityTotal(selected)} SELECTED &nbsp; { currentStep !== step && <span><img onClick={() => handleIsAddingExtraItems(false)} src={iconEdit} className="icon-edit" width="65" /></span>}</h4>}
                </div>
            }
            <br></br>
            { step !== 4 && this.progressBarStatus(getQuantityTotal(selected))}  
            
            <br></br>
            
            <CardFilters
                filterOptions={filterOptions}
                handleFiltersUpdate={handleFiltersUpdate}
                selected={selected}
                filters={filters}
                optionCounts={optionCounts}
                totalOptionCount={choices.length}
            />
        </LayoutSection>
        <br></br>
        <Layout>
            {filteredChoicesSection}
        </Layout>

        <section className="menu-section__actions actions--menu-section">
            <button className={`btn btn-primary-small btn-app${(getQuantityTotal(selected) < freeQuantityLimit && currentStep !== 4) ? ' btn-disabled' : ''}`} onClick={handleConfirm}>Confirm & Continue</button>
        </section>
        
    </section>;
    
        return (
            <Frame>
                <a id={`anchor-step--${step}`}/>

                <img src={sectionCollapsed ? accordionCollapse : accordionOpen} className='accordion' onClick={handleAccordion} />

                <Modal
                    isOpen={isSectionFilled && dismissedUnderScheme !== activeScheme && !isRestoringCart && currentStep === step && !returnToPayment}
                    onRequestClose={() => dismissModal()}
                    className="modal-entree-complete"
                >   
                    <h1 className='uppercase text-center'>{title} Selections Complete!</h1>
                    
                    <h2 className='text-center'>Care to add extra {title}</h2>
                    {currentStep === 2 &&
                       <p className="text-center">Round out your week with additional entr??es (lunches, breakfast, etc.). Quick note: Each additional entr??e serves one and costs $12. (Multiple portions of the same selection may be packed together.)
                       </p>
                    }

                    {currentStep === 3 &&
                       <p className="text-center">Round out your week with additional small plates. Quick note: Each additional small plate serves one and costs $7. (Multiple portions of the same selection may be packed together.)
                       </p>
                    } 
                    {/* <p className='text-center'>Round out your week with additional entr??es (lunches, breakfast, etc.). Quick note: Each additional entr??e serves one and costs <b>$12</b>. (Multiple portions of the same selection may be packed together.)</p> */}
                    <button className='btn btn-primary-small' onClick={() => this.showSectionExtras()}><span><img src={iconPlus} width={65} className="icon-plus-alt"/></span> Add Extra {title}</button>
                    <button className='btn btn-secondary-small' onClick={() => this.skipSectionExtras()}>Continue to {title === 'Entr??es' ? 'Small Plates' : 'Add-ons'} <span><img src={iconArrowRight} width={65} className="icon-arrow-alt"/></span></button>

                </Modal>

                { currentStep === step && 
                    <div>
                        { isSectionFilled && overviewSection }
                        { dishSection }
                    </div>
                }
                
                { currentStep !== step && overviewSection }
            </Frame>
        )
    }}