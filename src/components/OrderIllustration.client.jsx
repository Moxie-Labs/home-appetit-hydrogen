import onePerson from "../assets/one-person.svg";
import twoPeople from "../assets/two-people.svg";
import threePeople from "../assets/three-people.svg";
import fourPeople from "../assets/four-people.svg";
import smallPlate from "../assets/small-plate.svg";
import largePlate from "../assets/large-plate.svg";

export default function OrderIllustration(props){

    const {activeScheme, servingCount, planPrice} = props;

    const setPeople = (servingCount) => {
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

    const setPeopleImg = (servingCount, activeScheme) => {
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
        }
    }

    const elementsList = (servingCount) => {
        const elements = [];

        for (let i = 0  ; i < servingCount; i++) {
          elements.push(<div>
                            <div className='illustration-flex-section'>
                                <div className='illustration-flex-person'>
                                    <img src={onePerson} width="27"/>
                                </div>
                                <div className='illustration-small-plate'> 
                                    <img src={smallPlate} width="30" />
                                </div>
                                <div className='illustration-small-plate'>
                                    <img src={smallPlate} width="30" />
                                </div>
                                <div className='illustration-small-plate'> 
                                    <img src={smallPlate} width="30" />
                                </div>
                                <div className='illustration-small-plate'> 
                                    <img src={smallPlate} width="30" />
                                </div>
                            </div>
                            <div className='illustration-flex-section'>
                                <div className='illustration-large-plate'> 
                                    <img src={largePlate} width="34" />
                                </div>
                                <div className='illustration-large-plate'> 
                                    <img src={largePlate} width="34" />
                                </div>
                                <div className='illustration-large-plate'> 
                                    <img src={largePlate} width="34" />
                                </div>
                                <div className='illustration-large-plate'> 
                                    <img src={largePlate} width="34" />
                                </div>
                            </div>
                        </div>);
        }
      
        return elements;
    }
        
        return (
            <div>
                <div className='illustration-total'>${planPrice}</div>
                <div className='illustration-desc'>{activeScheme === 'traditional' ? 'Classic Order' : 'Flex Ordering'}-{setPeople(servingCount)}</div>
                <div className='illustration-desc-sub'>{servingCount === '1' || servingCount === 0 ? "4-6 Meals" : "4-6 Meals Per Person"}</div>
                <div className='illustration-desc-division'></div>
                <div className='illustration-desc-underline'>
                    {servingCount === '1' || servingCount === 0 ? "Build your ideal menu!" : "Everyone will enjoy the same selections!"}
                </div>
                <div className='illustration-section'>
                    <div className='illustration-section-img'>
                        {activeScheme === 'traditional' && <img src={setPeopleImg(servingCount, activeScheme)} />}
                    </div>
                    <div className='illustration-section-img-1'> 
                        <img src={smallPlate} width="28" />
                        { activeScheme === 'traditional' ?
                        <span className='illustration-section-text'>4 Small Plates</span>
                        :
                        <span className='illustration-section-text'>{servingCount === 0 ? 4:servingCount*4} Small Plates</span>
                        }
                    </div>
                    <div className='illustration-section-img-2'>
                        <img src={largePlate} width="30" />
                        { activeScheme === 'traditional' ?
                        <span className='illustration-section-text'>4 Large Plates</span>
                        :
                        <span className='illustration-section-text'>{servingCount === 0 ? 4:servingCount*4} Large Plates</span>
                        }
                    </div>
                    {activeScheme === 'traditional' ? 
                    <div className="illustration-trad">
                        <div className='illustration-image-section'>
                            <div className='illustration-small-plate'> 
                                <p className={`illustration-section-badge${servingCount === '1' || servingCount === 0 ? "-hidden" : "" }`}>
                                    x{servingCount}
                                </p>
                                <img src={smallPlate} width="50" />
                            </div>
                            <div className='illustration-small-plate'>
                                <p className={`illustration-section-badge${servingCount === '1' || servingCount === 0 ? "-hidden" : "" }`}>
                                    x{servingCount}
                                </p>
                                <img src={smallPlate} width="50" />
                            </div>
                            <div className='illustration-small-plate'> 
                                <p className={`illustration-section-badge${servingCount === '1' || servingCount === 0 ? "-hidden" : "" }`}>
                                    x{servingCount}
                                </p>
                                <img src={smallPlate} width="50" />
                            </div>
                            <div className='illustration-small-plate'> 
                                <p className={`illustration-section-badge${servingCount === '1' || servingCount === 0 ? "-hidden" : "" }`}>
                                    x{servingCount}
                                </p>
                                <img src={smallPlate} width="50" />
                            </div>
                        </div>
                        <div className='illustration-image-section'>
                            <div className='illustration-large-plate'> 
                                <p className={`illustration-section-badge${servingCount === '1' || servingCount === 0 ? "-hidden" : "" }`}>
                                    x{servingCount}
                                </p>
                                <img src={largePlate} width="52" />
                            </div>
                            <div className='illustration-large-plate'> 
                                <p className={`illustration-section-badge${servingCount === '1' || servingCount === 0 ? "-hidden" : "" }`}>
                                    x{servingCount}
                                </p>
                                <img src={largePlate} width="52" />
                            </div>
                            <div className='illustration-large-plate'> 
                                <p className={`illustration-section-badge${servingCount === '1' || servingCount === 0 ? "-hidden" : "" }`}>
                                    x{servingCount}
                                </p>
                                <img src={largePlate} width="52" />
                            </div>
                            <div className='illustration-large-plate'> 
                                <p className={`illustration-section-badge${servingCount === '1' || servingCount === 0 ? "-hidden" : "" }`}>
                                    x{servingCount}
                                </p>
                                <img src={largePlate} width="52" />
                            </div>
                        </div>
                    </div>
                    :
                    <div className="illustration-flex">
                        {elementsList(servingCount)}
                    </div>
                    }
                </div>
            </div>
        );
}