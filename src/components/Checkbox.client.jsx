import iconChecked from '../assets/icon-checkbox--checked.png';
import iconUnchecked from '../assets/icon-checkbox--unchecked.png';

export function Checkbox(props) {

    const { label, checked, handleClick, price, disabled } = props;

    const iconSrc = checked ? iconChecked : iconUnchecked;

    return (
        <div className={`checkbox-elem${disabled ? 'disabled' : ''}`} onClick={handleClick}>
            <img src={iconSrc}/>
            <div className='checkbox-elem--text'>
                <span>{label}</span>
                <strong>{price}</strong>
            </div>
        </div>
    );
}