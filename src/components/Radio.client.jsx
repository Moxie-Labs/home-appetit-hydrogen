export function Radio(props) {

    const {handleClick, name, isChecked, label} = props;

    return (
        <div className="radio" onClick={handleClick}>
            <input type="radio" name={name} checked={isChecked} />
            <label for="method" className='radio-label'>{label}</label>
        </div>
    );
}