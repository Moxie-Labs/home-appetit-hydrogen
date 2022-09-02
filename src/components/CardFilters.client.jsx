import React, {useState, useCallback} from 'react';
import {ButtonGroup} from './ButtonGroup.client';

export default class CardFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // selected: [],
            // filters: [] 
        };

        this.filterChoices = this.filterChoices.bind(this);
        this.isFilterSelected = this.isFilterSelected.bind(this);
        this.toggleFilter = this.toggleFilter.bind(this);
    }

    filterChoices() {
        const {choices, filters} = this.props;
        let retval = [];
        if (filters.length < 1) {
            retval = choices;
        }
        else {
            for (let choice of choices) {
                for(let filter of filters) {
                    if (choice.attributes.includes(filter)) {
                        retval.push(choice);
                        break;
                    }
                }
            }
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
                filters = [];
            } else {
                console.log("Adding filter", filter);
                filters.push(filter);
            }
        }
        filters = [...filters]
        this.props.handleFiltersUpdate(filters);
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

    render() {

        const {filterOptions, totalOptionCount, optionCounts} = this.props;

        console.log("optionCounts", optionCounts);

        const filterButtons = filterOptions.map((option) => {
            const isActive = this.isFilterSelected(option.value);
            const label = (option.value === 'ALL' ? `${option.label} (${totalOptionCount})` : `${option.label} (${optionCounts[option.label]})`)
            return <button key={option.label} className={`button-group--item filterButton${isActive ? ' active' : ''} ${optionCounts[option.label] < 1 && option.value !== "ALL" ? ' disabled' : ''}`} pressed={isActive} disabled={(optionCounts[option.label] < 1 && option.value !== "ALL")} onClick={() => this.toggleFilter(option.value)}>{label}</button>
        });

        return (
            <ButtonGroup>
                {filterButtons}
            </ButtonGroup>
        );
    }
}