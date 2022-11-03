import React from 'react';
import onePerson from "../assets/one-person.svg";
import twoPeople from "../assets/two-people.svg";
import threePeople from "../assets/three-people.svg";
import fourPeople from "../assets/four-people.svg";
import smallPlate from "../assets/small-plate.svg";
import largePlate from "../assets/large-plate.svg";

class OrderIllustration extends React.Component {

    constructor(props) {
        super(props);
    }

    setPeople(servingCount){
        switch(servingCount) {
            case '2':
            return 'Two People';
            case '3':
            return 'Three People';
            case '4':
            return 'Four People';
            case '5':
            return 'Five People';
            default:
            return 'One Person';
        }

    }

    setPeopleImg(servingCount, activeScheme){
        if(activeScheme === 'traditional'){
            switch(servingCount) {
                case '2':
                return twoPeople;
                case '3':
                return threePeople;
                case '4':
                return fourPeople;
                case '5':
                return fourPeople;
                default:
                return onePerson;
            }
        }   else    {
            switch(servingCount) {
                case '2':
                return '$180';
                case '3':
                return '$230';
                case '4':
                return '$280';
                case '5':
                return '$330';
                default:
                return '$100';
            }
        }
    }

    setTotal(servingCount, activeScheme){
        if(activeScheme === 'traditional'){
            switch(servingCount) {
                case '2':
                return '$150';
                case '3':
                return '$200';
                case '4':
                return '$250';
                case '5':
                return '$300';
                default:
                return '$100';
            }
        }   else    {
            switch(servingCount) {
                case '2':
                return '$180';
                case '3':
                return '$230';
                case '4':
                return '$280';
                case '5':
                return '$330';
                default:
                return '$100';
            }
        }
    }

    render() {
        const {activeScheme, servingCount} = this.props;
        return (
            <div>
                <div className='illustration-total'>{this.setTotal(servingCount, activeScheme)}</div>
                <div className='illustration-desc'>{activeScheme === 'traditional' ? 'Classic Order' : 'Flex Ordering'}-{this.setPeople(servingCount)}</div>
                <div className='illustration-desc-sub'>{servingCount === '1' || servingCount === 0 ? "4-6 Meals" : "4-6 Meals Per Person"}</div>
                <div className='illustration-desc-division'></div>
                <div className='illustration-desc-underline'>
                    {servingCount === '1' || servingCount === 0 ? "Build your ideal menu!" : "Everyone will enjoy the same selections!"}
                </div>
                <div className='illustration-section'>
                    <div className='illustration-section-img'>
                        <img src={this.setPeopleImg(servingCount, activeScheme)} />
                    </div>
                    <div className='illustration-section-img-1'> 
                        <img src={smallPlate} width="30" />
                        <span className='illustration-section-text'>4 Small Plates</span>
                    </div>
                    <div className='illustration-section-img-2'>
                        <img src={largePlate} width="30" />
                        <span className='illustration-section-text'>4 Large Plates</span>
                    </div>
                    <div className='illustration-section-img-3'> 
                        <img src={smallPlate} width="50" />
                    </div>
                    <div className='illustration-section-img-4'> 
                        <img src={smallPlate} width="50" />
                    </div>
                    <div className='illustration-section-img-5'> 
                        <img src={smallPlate} width="50" />
                    </div>
                    <div className='illustration-section-img-6'> 
                        <img src={smallPlate} width="50" />
                    </div>
                    <div className='illustration-section-img-7'> 
                        <img src={largePlate} width="50" />
                    </div>
                    <div className='illustration-section-img-8'> 
                        <img src={largePlate} width="50" />
                    </div>
                    <div className='illustration-section-img-9'> 
                        <img src={largePlate} width="50" />
                    </div>
                    <div className='illustration-section-img-10'> 
                        <img src={largePlate} width="50" />
                    </div>
                </div>
            </div>
        );
    }
    
}

export default OrderIllustration;