export function ActiveForm(props) {

    const formHTMLMin = `
        <div class="_form_15"><script src="https://homeappetitphilly.activehosted.com/f/embed.php?id=15" type="text/javascript" charset="utf-8"></script></div>
    `;

    const formHTML = `
            <form method="POST" action="https://homeappetitphilly.activehosted.com/proc.php" id="_form_15_" class="_form _form_15 _inline-form  _dark" novalidate>
            <input type="hidden" name="u" value="15" />
            <input type="hidden" name="f" value="15" />
            <input type="hidden" name="s" />
            <input type="hidden" name="c" value="0" />
            <input type="hidden" name="m" value="0" />
            <input type="hidden" name="act" value="sub" />
            <input type="hidden" name="v" value="2" />
            <input type="hidden" name="or" value="1ee8a7319511ec9bf608aa95101fb437" />
            <div class="_form-content">
                <div class="_form_element _x11194530 _full_width " >
                <label for="email" class="_form-label">
                </label>
                <div class="_field-wrapper">
                    <input type="text" id="email" name="email" placeholder="Type your email" required/>
                </div>
                </div>
                <div class="_button-wrapper _full_width">
                <button id="_form_15_submit" class="_submit" type="submit">
                    Submit
                </button>
                </div>
                <div class="_clear-element">
                </div>
            </div>
            <div class="_form-thank-you" style="display:none;">
            </div>
            </form>
    `

    return (
        <section>
            <div dangerouslySetInnerHTML={{__html: formHTML}}></div>
        </section>
    );
}