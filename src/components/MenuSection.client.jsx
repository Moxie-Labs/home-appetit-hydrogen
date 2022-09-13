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

export default class MenuSection extends React.Component {

    constructor(props) {  
        super(props);
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

    render() { 

        const {step, currentStep, title, subheading, freeQuantityLimit, selected, collection, filters, filterOptions, handleFiltersUpdate, handleConfirm, handleEdit, servingCount, choices, handleItemSelected, getQuantityTotal, noQuantityLimit} = this.props;
        const additionalEntrees = 0;
        const filteredChoices = this.filterChoices(selected);

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
    
        return (
            <Frame>
                { currentStep === step && 
                    <section className="step-section ha-color-bg-body">   
                        <LayoutSection>
                            <h2 sectioned className="heading order_prop__heading ha-h3">Step {step}: {title}</h2>
                            <p className="subheading order_prop__subheading p-subheading-width">{subheading}</p>
                            { !noQuantityLimit && <h4 className="ha-h4 quantity-indicator">{getQuantityTotal(selected)}/{freeQuantityLimit} SELECTED &nbsp; { currentStep !== step && <span><img src={iconEdit.src} className="icon-edit" width="65" /></span>}</h4>}
                            { noQuantityLimit && <h4 className="ha-h4 quantity-indicator">{getQuantityTotal(selected)} SELECTED &nbsp; { currentStep !== step && <span><img src={iconEdit.src} className="icon-edit" width="65" /></span>}</h4>}
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
                        
                    </section>
                }
                
                { currentStep !== step && 
                    <section>
                        <h2 sectioned className="heading order_prop__heading ha-h3">Step {step}: {title}</h2>
                        { Object.keys(selected).length !== 0 && 
                        <div className="suborder--summary-container">
                            <div className="suborder--summary-details">
                                <h4 className="ha-h4">{getQuantityTotal(selected)}/{freeQuantityLimit} SELECTED &nbsp; <span><img onClick={handleEdit} src={iconEdit.src} className="icon-edit" width="65" /></span></h4>
                                {Object.keys(selected).map(function(key) {
                                    return ( 
                                        <ul key={key} className="step--order-summary">
                                            <li>({selected[key].quantity}) {selected[key].choice.title} <span>{selected[key].choice.description}</span></li>
                                        </ul>
                                    )
                                })}
                            </div>
                            
                            { step === 2 && additionalEntrees >= 1 &&
                                <div className="suborder--summary-additional">
                                    <div className="summary--additional-wrapper">
                                        <h4 className="ha-h4">{additionalEntrees} Additional entrées &nbsp; <span><img src={iconEdit.src} className="icon-edit" width="65"/></span></h4>
                                    </div>
                                </div> 
                            } 

                            {step === 2 && additionalEntrees === 0 &&
                                <div className="suborder--summary-additional small-plates">
                                    <div className="summary--additional-wrapper small-plates-wrapper">
                                        <h4 className="ha-h4">Add Extra Entrées</h4>
                                        <p>Varius vel, ornare id aliquet sit tristique sit nisl. Amet vel sagittis null quam es. Digs nissim sit est velit lore varius vel, ornare id.</p>
                                        <button className="btn-small-plates"><span><img src={iconPlus.src} className="icon-plus"/></span> Add Extra Entrées</button>
                                    </div>
                                </div> 
                            }

                            {step === 3 &&
                                <div className="suborder--summary-additional small-plates">
                                    <div className="summary--additional-wrapper small-plates-wrapper">
                                        <h4 className="ha-h4">Add Extra Small Plates</h4>
                                        <p>Varius vel, ornare id aliquet sit tristique sit nisl. Amet vel sagittis null quam es. Digs nissim sit est velit lore varius vel, ornare id.</p>
                                        <button className="btn-small-plates"><span><img src={iconPlus.src} className="icon-plus"/></span> Add extra Small Plates</button>
                                    </div>
                                </div> 
                            } 
                        </div>
                        }
                    </section>
                }
            </Frame>
        )
    }}