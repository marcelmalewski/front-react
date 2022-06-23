import React, { useState, useEffect } from 'react'
import './PersonFilters.scss'
import { connect } from "react-redux";
import { personSendCountryFiltersAction, personSendNameFilterAction, personSendPeriodFilterAction } from '../../ducks/persons/actions';
import Select from 'react-select';
import { getPersonCountryFilters, getPersonNameFilter, getPersonPeriodFilter } from '../../ducks/persons/selectors';

function PersonFilters({ 
    personSendCountryFiltersAction, 
    personSendPeriodFilterAction, 
    personSendNameFilterAction,
    countryFilters,
    periodFilter,
    nameFilter
}) {
    const [nameFilterValue, setNameFilterValue] = useState(nameFilter);
    const savedCountryFilters = countryFilters.map(el => ({ value: el, label: el}))
    const [savedPerioedFilterIsLoaded, setSavedPerioedFilterIsLoaded] = useState(false)

    const countriesOptions = [
        { value: 'Russia', label: 'Russia'},
        { value: 'Germany', label: 'Germany'},
        { value: 'France', label: 'France'},
        { value: 'Spain', label: 'Spain'},
        { value: 'Poland', label: 'Poland'},
        { value: 'Canada', label: 'Canada'},
        { value: 'Ukraine', label: 'Ukraine'},
        { value: 'Austira', label: 'Austria'},
        { value: 'Monako', label: 'Monako'},
        { value: 'Norway', label: 'Norway'},
        { value: 'Japoan', label: 'Japan'},
        { value: 'China', label: 'China'},
        { value: 'Finland', label: 'Finland'},
        { value: 'Barcelona',label: 'Barcelona'},
        { value: 'Mesico', label: 'Mexico'},
        { value: 'Hawaii', label: 'Hawaii'},
    ]

    const periods = [
        { key: '1985-1990', value: '1985-1990'},
        { key: '1990-1995', value: '1990-1995'},
        { key: '1995-2000', value: '1995-2000'},
        { key: '2000-2005', value: '2000-2005'},
        { key: '2005-2010', value: '2005-2010'},
        { key: '2015-2020', value: '2015-2020'},
        { key: '2020-2025', value: '2020-2025'},
    ]

    const handleChangeOfFilers = (event) => {
        const newCountryFilters = event.map(el => el.value)
        personSendCountryFiltersAction(newCountryFilters)
    }

    const handlePeriodChange = (event) => {
        personSendPeriodFilterAction(event)
    }

    const handleClearPeriodFilter = () => {
        const radioButtons = document.getElementsByName('radioPeriod')
        radioButtons.forEach(el => el.checked = false)
        personSendPeriodFilterAction("")
    }

    const handleNameFilterOnChange = (event) => {
        setNameFilterValue(event)
        personSendNameFilterAction(event)
    }

    const customStyles = {
        control: (base, state) => ({
            ...base,
            borderRadius: '0px',
            background: "#444D7A",
            borderBottom: state.isFocused ? '0px' : '1px solid black',
            borderTop: '0px',
            borderRight: '0px',
            borderLeft: '0px',
            "&:hover": {
            borderColor: state.isFocused ? "blue" : "orange"
            }
        }),
        multiValue: base => ({
            ...base,
            paddingLeft: 4,
            borderRadius: 5,
            background: '#444D7A',
            color: '#a3c0ff',
        }),
        multiValueRemove: (base, state) => ({
            ...base,
            fontSize: "18px",
            height: "20",
            "&:hover": {
                background: "#444D7A",
                color: "black"
                }
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: '#a3c0ff',
            fontSize: "20px"
        }),
        dropdownIndicator: base => ({
            ...base,
            color: "#bdbdbd"
        }),
        clearIndicator: base => ({
            ...base,
            color: "#bdbdbd"
        }),
        placeholder: (base) => ({
            ...base,
            fontSize: '20px',
            color: "#a3c0ff",
            fontWeight: 400,
        }),
        input: (base, state) => ({
            ...base,
            color: '#a3c0ff'
        }),
        menu: base => ({
          ...base,
          marginTop: -20,
          background: "#D3D3D3",
          color: "#0037b1",
        }),
        menuList: base => ({
          ...base,
          padding: 0,
        })
    };

    useEffect(() => {
        if(savedPerioedFilterIsLoaded === false){
            if(periodFilter !== ''){
                document.getElementById(periodFilter).checked = true
            }

            setSavedPerioedFilterIsLoaded(true)
        }

    }, [savedPerioedFilterIsLoaded, periodFilter]);

    return (
        <div className='PersonFiltersBox'>
            <div className='TitleAndClearBox'>
                <p className='pFilters'>Filters</p>
            </div>
            <div className='filters'>
                <Select
                    isMulti
                    name="countries"
                    options={countriesOptions}
                    className="countriesSelect"
                    styles={customStyles}
                    placeholder="Select..."
                    onChange={handleChangeOfFilers}
                    defaultValue={savedCountryFilters}
                />
            </div>
            <form id='periodForm' onChange={(event) => handlePeriodChange(event.target.value)}>
                <p className='filterP'>Select period of birth:</p>
                <div className='fPeriods'>
                    {periods.map(period =>
                        <div className='onePeriod' key={period.key} >
                            <input type='radio' id={period.value} value={period.value} name='radioPeriod'/>
                            <label htmlFor={period.value}>
                                {period.key}
                            </label>
                        </div>
                    )}
                </div>
            </form>
            <div className='buttonBox'>
                <button onClick={handleClearPeriodFilter}>Clear</button>
            </div>
            <p className='filterP'>Filter by name:</p>
            <input 
                name="nameFilter" 
                onChange={(event) => handleNameFilterOnChange(event.target.value)}
                value={nameFilterValue}
                placeholder="Type name..."
            />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        countryFilters: getPersonCountryFilters(state),
        periodFilter: getPersonPeriodFilter(state),
        nameFilter: getPersonNameFilter(state)
    };
}

const mapDispatchToProps = {
    personSendCountryFiltersAction,
    personSendPeriodFilterAction,
    personSendNameFilterAction
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonFilters);