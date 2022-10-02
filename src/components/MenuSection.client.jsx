import React from 'react';
// import CardFilters from "./CardFilters.client";
// import DishCard from "./DishCard";
import iconEdit from "../assets/icon-edit.png";
import iconPlus from "../assets/icon-plus.png";
import { Frame } from './Frame.client';
import { LayoutSection } from './LayoutSection.client';
import { Layout } from './Layout.client';
import CardFilters from './CardFilters.client';
import DishCard from './DishCard.client';
import Modal from 'react-modal/lib/components/Modal';

export default class MenuSection extends React.Component {

    constructor(props) {  
        super(props);
        this.state = {
            showingExtra: false,
            modalDismissed: false
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
            console.log("Removing filter", filter)
            const index = filters.indexOf(filter);
            filters.splice(index, 1);
        } else {
            if (filter === 'ALL') {
                filters = filters.splice(0, filter.length);
            } else {
                console.log("Adding filter", filter);
                filters.push(filter);
            }
        }
        this.setState(filters);
        console.log("filters", filters);
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
        //switch case not working with > 4 (weird). I know looks ugly but 'if' works...
        if(getQuantityTotal === 1) {
              return (
                <div className="progress-bar">
                    <div className="progress-bar__order-item active"></div>
                    <div className="progress-bar__order-item"></div>
                    <div className="progress-bar__order-item"></div>
                    <div className="progress-bar__order-item"></div>
                </div>
              );
          }

       else if(getQuantityTotal === 2) {
            return (
              <div className="progress-bar">
                  <div className="progress-bar__order-item active"></div>
                  <div className="progress-bar__order-item active"></div>
                  <div className="progress-bar__order-item"></div>
                  <div className="progress-bar__order-item"></div>
              </div>
            );
        }

       else if(getQuantityTotal === 3) {
            return (
              <div className="progress-bar">
                  <div className="progress-bar__order-item active"></div>
                  <div className="progress-bar__order-item active"></div>
                  <div className="progress-bar__order-item active"></div>
                  <div className="progress-bar__order-item"></div>
              </div>
            );
        }

       else if(getQuantityTotal >= 4) {
            return (
              <div className="progress-bar">
                  <div className="progress-bar__order-item active"></div>
                  <div className="progress-bar__order-item active"></div>
                  <div className="progress-bar__order-item active"></div>
                  <div className="progress-bar__order-item active"></div>
              </div>
            );
        } else {
            return (
                <div className="progress-bar">
                    <div className="progress-bar__order-item"></div>
                    <div className="progress-bar__order-item"></div>
                    <div className="progress-bar__order-item"></div>
                    <div className="progress-bar__order-item"></div>
                </div>
            );
        }
    }

    getExistingQuantity(dish) {
        const { collection } = this.props;
        let quantity = 0;
    
        collection.map((item, i) => {
            if (item.choice.title === dish.title) 
                quantity = item.quantity;
        });

        return quantity;
    }

    showSectionExtras() {
        this.setState({showingExtra: true, modalDismissed: true});
    }

    skipSectionExtras() {
        this.props.handleConfirm;
        this.setState({modalDismissed: true})
    }

    getSplitSelections() {
        const { selected, freeQuantityLimit } = this.props;
        const mainSelections = [];
        const extraSelections = [];
        let totalQuantity = 0;
        Object.keys(selected).map(key => {
            if (totalQuantity < freeQuantityLimit) {
                mainSelections.push(selected[key]);
                totalQuantity += selected[key].quantity;
            } else {
                extraSelections.push(selected[key]);
            }
            
        });
        return {
            mainSelections: mainSelections,
            extraSelections: extraSelections
        };
    }

    render() { 

        const {step, currentStep, title, subheading, freeQuantityLimit, selected, collection, filters, filterOptions, handleFiltersUpdate, handleConfirm, handleEdit, servingCount, choices, handleItemSelected, getQuantityTotal, noQuantityLimit, isSectionFilled} = this.props;
        const {modalDismissed, showingExtra} = this.state;
        const additionalEntrees = 0;
        const filteredChoices = this.filterChoices(selected);

        const splitSelections = this.getSplitSelections();

        const mainSelected = splitSelections.mainSelections;
        const extraSelected = splitSelections.extraSelections;

        console.log("mainSelected", mainSelected)

        let filteredChoicesSection;
        if (filteredChoices.length > 0) {
            filteredChoicesSection = filteredChoices.map((choice) => {
                const intialQuantity = collection

                return (
                    <div className="dish-card-item" key={choice.title}>
                        <DishCard 
                            choice={choice} 
                            freeQuantityLimit={freeQuantityLimit} 
                            servingCount={servingCount}
                            handleSelected={handleItemSelected}
                            initialQuantity={this.getExistingQuantity(choice)}
                            confirmed={this.getExistingQuantity(choice) > 0}
                            maxQuantity={(freeQuantityLimit - getQuantityTotal(selected))}
                            showingExtra={showingExtra}
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


        // Render Sections
        const overviewSection = <section>
        <h2 sectioned className="heading order_prop__heading ha-h3">Step {step}: {title}</h2>
        { Object.keys(selected).length !== 0 && 
        <div className="suborder--summary-container">
            <div className="suborder--summary-details">
                <h4 className="ha-h4">{Math.min(getQuantityTotal(selected), freeQuantityLimit)}/{freeQuantityLimit} SELECTED &nbsp; <span><img onClick={handleEdit} src={iconEdit.src} className="icon-edit" width="65" /></span></h4>
                {Object.keys(mainSelected).map(function(key) {
                    return ( 
                        <ul key={key} className="step--order-summary">
                            <li>({mainSelected[key].quantity}) {mainSelected[key].choice.title} <span>{mainSelected[key].choice.description}</span></li>
                        </ul>
                    )
                })}
            </div>
            
            { isSectionFilled &&
                <div className="suborder--summary-additional">
                    <div className="summary--additional-wrapper">
                        <h4 className="ha-h4">{extraSelected.length} Additional entrées &nbsp; <span><img src={iconEdit.src} className="icon-edit" width="65"/></span></h4>
                        {Object.keys(extraSelected).map(function(key) {
                            return ( 
                                <ul key={key} className="step--order-summary">
                                    <li>({extraSelected[key].quantity}) {extraSelected[key].choice.title} <span>{extraSelected[key].choice.description}</span></li>
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
                    <h2 sectioned className="heading order_prop__heading ha-h3">Step {step}: {title}</h2>
                    <p className="subheading order_prop__subheading p-subheading-width">{subheading}</p>
                    { !noQuantityLimit && <h4 className="ha-h4 quantity-indicator">{getQuantityTotal(selected)}/{freeQuantityLimit} SELECTED &nbsp; { currentStep !== step && <span><img src={iconEdit.src} className="icon-edit" width="65" /></span>}</h4>}
                    { noQuantityLimit && <h4 className="ha-h4 quantity-indicator">{getQuantityTotal(selected)} SELECTED &nbsp; { currentStep !== step && <span><img src={iconEdit.src} className="icon-edit" width="65" /></span>}</h4>}
                </div>
            }
                        <br></br>
            {this.progressBarStatus(getQuantityTotal(selected))}  
            
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

        <section className="menu-section__actions">
            <button className={`btn btn-primary-small btn-app${(getQuantityTotal(selected) < freeQuantityLimit && currentStep !== 4) ? ' btn-disabled' : ''}`} onClick={handleConfirm}>Confirm Selections</button>
        </section>
        
    </section>;
    
        return (
            <Frame>

                <Modal
                    isOpen={isSectionFilled && !modalDismissed}
                    onRequestClose={() => this.setState({showingModal: false})}
                    className="modal-entree-complete"
                >   
                    <h1 className='uppercase text-center'>{title} Selection Complete!</h1>
                    <h2 className='text-center'>Care to add extra {title}</h2>
                    <p className='text-center'>Esit est velit lore varius vel, ornare id aliquet sit. Varius vel, ornare id aliquet sit tristique sit nisl. 
                    Amet vel sagittis null quam es. Digs nissim sit est velit lore varius vel, ornare id aliquet sit tristique sit nisl. Amet vel sagittis null quam <b>$12.50</b> each.</p>
                    <button className='btn btn-primary-small' onClick={() => this.showSectionExtras()}>+ Add Extra {title}</button>
                    <button className='btn btn-secondary-small' onClick={() => this.skipSectionExtras()}>Continue to {title === 'Entrées' ? 'Small Plates' : 'Add-ons'}</button>

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