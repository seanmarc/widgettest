
/*NOTE:
These 4 functions are used to auto format the phone number input. 


*/
const isNumericInput = (event) => {
    const key = event.keyCode;
    return ((key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
    );
};

const isModifierKey = (event) => {
    const key = event.keyCode;
    return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
        (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        (
            // Allow Ctrl/Command + A,C,V,X,Z
            (event.ctrlKey === true || event.metaKey === true) &&
            (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
        )
};

const enforceFormat = (event) => {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if(!isNumericInput(event) && !isModifierKey(event)){
        event.preventDefault();
    }
};

const formatToPhone = (event) => {
    if(isModifierKey(event)) {return;}

    const input = event.target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
    const areaCode = input.substring(0,3);
    const middle = input.substring(3,6);
    const last = input.substring(6,10);

    if(input.length > 6){event.target.value = `(${areaCode}) ${middle} - ${last}`;}
    else if(input.length > 3){event.target.value = `(${areaCode}) ${middle}`;}
    else if(input.length > 0){event.target.value = `(${areaCode}`;}
};
const API_URI = "https://api.eyerate.tech";
const BUCKET_URL = "http://eyerate-widget-chat.s3-website.us-east-2.amazonaws.com";
document.addEventListener("DOMContentLoaded", async function() {
    var me = document.querySelector('script[data-id][data-name="EyeRate"]');
    var id = me.getAttribute('data-id');    

    // eslint-disable-next-line no-undef
    const settings = await (await fetch(`${BUCKET_URL}/settings/${id}/settings.json`)).json();
    /*NOTE:
    We start off by making an API call to get the settings for the corresponding widget. This includes color and text options for them.
    */
    const color = settings?.color || '#36ADAD';
    var chatButton = document.createElement('div');
    chatButton.style.position = 'fixed';
    chatButton.style.bottom = '20px';
    chatButton.style.right = '20px';
    chatButton.style.width = '75px';
    chatButton.style.height = '75px';
    chatButton.style.borderRadius = '50%';
    chatButton.style.backgroundColor = color;
    chatButton.style.cursor = 'pointer';
    chatButton.style.boxShadow = '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)';
    chatButton.style.transition = 'all 0.2s ease-in-out';
    chatButton.onmouseover = function() {
    chatButton.style.transform = 'scale(1.1)';
    };
    chatButton.onmouseout = function() {
    chatButton.style.transform = 'scale(1)';
    };
    var chatIcon = document.createElement('img');
    chatIcon.src = 'https://icon-library.com/images/speech-bubbles-icon/speech-bubbles-icon-22.jpg';
    chatIcon.style.width = '45px';
    chatIcon.style.height = '45px';
    chatIcon.style.position = 'absolute';
    chatIcon.style.top = '50%';
    chatIcon.style.left = '50%';
    chatIcon.style.transform = 'translate(-50%, -50%)';
    chatButton.appendChild(chatIcon);
    document.body.appendChild(chatButton);
    var chatBox = document.createElement('div');
    chatBox.style.position = 'fixed';
    chatBox.style.bottom = '110px';
    chatBox.style.right = '20px';
    chatBox.style.width = '300px';
    chatBox.style.height = '400px';
    chatBox.style.borderRadius = '5px';
    chatBox.style.backgroundColor = 'white';
    chatBox.style.boxShadow = '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)';
    chatBox.style.display = 'none';
    chatBox.style.transition = 'all 0.2s ease-in-out';
    chatButton.onclick = function() {
    if (chatBox.style.display === 'none') {
    chatBox.style.display = 'block';
    } else {
    chatBox.style.display = 'none';
    }
    };
    document.body.appendChild(chatBox);

    var chatBoxHeader = document.createElement('div');
    chatBoxHeader.style.width = '100%';
    chatBoxHeader.style.height = '50px';
    chatBoxHeader.style.backgroundColor = color;
    chatBoxHeader.style.borderTopLeftRadius = '5px';
    chatBoxHeader.style.borderTopRightRadius = '5px';
    chatBoxHeader.style.textAlign = 'center';
    chatBoxHeader.style.lineHeight = '50px';
    chatBoxHeader.style.fontSize = '20px';
    chatBoxHeader.style.color = 'white';
    chatBoxHeader.style.fontWeight = 'bold';
    chatBoxHeader.innerHTML = 'Send us a message!';
    chatBox.appendChild(chatBoxHeader);

    var chatBubble = document.createElement('div');
    chatBubble.style.width = '250px';
    chatBubble.style.height = '120px';
    chatBubble.style.position = 'absolute';
    chatBubble.style.top = '100px';
    chatBubble.style.left = '25px';
    chatBubble.style.borderRadius = '5px';
    chatBubble.style.backgroundColor = '#FCF5F4';
    chatBubble.style.color = 'black';
    chatBubble.style.padding = '10px';
    chatBubble.style.fontSize = '14px';
    chatBubble.innerHTML = 'Enter your information, and our team will text you shortly.';


    var chatBubbleForm = document.createElement('div');
    chatBubbleForm.style.width = '250px';
    chatBubbleForm.style.height = '250px';
    chatBubbleForm.style.position = 'relative';
    chatBubbleForm.style.borderRadius = '5px';
    chatBubbleForm.style.backgroundColor = 'white';
    chatBubbleForm.style.padding = '20px';
    chatBubbleForm.style.fontSize = '14px';
    chatBox.appendChild(chatBubbleForm);

    var nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.placeholder = 'Name';
    nameInput.style.width = '100%';
    nameInput.style.height = '30px';
    nameInput.style.marginBottom = '10px';
    nameInput.style.borderRadius = '5px';
    nameInput.style.border = `1px solid ${color}`;
    chatBubbleForm.appendChild(nameInput);

    var phoneInput = document.createElement('input');
    phoneInput.type = 'text';
    phoneInput.placeholder = 'Mobile Number';
    phoneInput.style.width = '100%';
    phoneInput.style.height = '30px';
    phoneInput.style.marginBottom = '10px';
    phoneInput.style.borderRadius = '5px';
    phoneInput.style.border = `1px solid ${color}`;
    phoneInput.addEventListener('keydown', enforceFormat);
    phoneInput.addEventListener('keyup', formatToPhone);
    chatBubbleForm.appendChild(phoneInput);


    var messageInput = document.createElement('textarea');
    messageInput.placeholder = 'Message...';
    messageInput.style.width = '100%';
    messageInput.style.height = '100px';
    messageInput.style.marginBottom = '10px';
    messageInput.style.borderRadius = '5px';
    messageInput.style.border = `1px solid ${color}`;
    messageInput.style.padding = '4px';
    chatBubbleForm.appendChild(messageInput);

    var submitButton = document.createElement('button');
    submitButton.innerHTML = 'Submit';
    submitButton.style.width = '100%';
    submitButton.style.height = '30px';
    submitButton.style.borderRadius = '5px';
    submitButton.style.border = `1px solid ${color}`;
    submitButton.style.backgroundColor = 'white';
    submitButton.style.color = color;
    submitButton.style.cursor = 'pointer';
    submitButton.style.transition = 'all 0.2s ease-in-out';
    submitButton.onmouseover = function() {
    submitButton.style.backgroundColor = color;
    submitButton.style.color = 'white';

    };
    submitButton.onmouseout = function() {
    submitButton.style.backgroundColor = 'white';
    submitButton.style.color = color;
    submitButton.backgroundColor.color = 'white';
    };
    chatBubbleForm.appendChild(submitButton);

    chatBox.style.height = '500px';
    chatBubble.style.top = '150px';

    chatBubble.style.top = '100px';

    chatBubble.style.left = '50%';
    chatBubble.style.transform = 'translateX(-50%)';
    chatBubbleForm.style.left = '50%';
    chatBubbleForm.style.transform = 'translateX(-50%)';

    chatBubble.style.width = '200px';
    chatBubble.style.height = '50px';

    chatBubble.style.left = '25px';
    chatBubble.style.transform = 'translateX(0%)';
    chatBubble.style.top = '50px';

    chatBubble.style.top = '60px';

    chatBubbleForm.style.top = '20px';


    submitButton.onclick = async function() {
        const params = {
            content: messageInput.value,
            phone: `+1${phoneInput.value.replaceAll('(','').replaceAll(')','').replaceAll('-','').replaceAll(' ','')}`,
            customerName: nameInput.value,
            id: settings?.location,
            email: settings?.email,
        };
            
            
        const options = {
            method: 'POST',
            mode: "cors",
            headers: {
            'Content-Type': 'application/json',
            accept: "application/json"
            },
            body: JSON.stringify(params),
            };
        // eslint-disable-next-line no-undef
        fetch('http://localhost:8081/v1/public/widget/chat/sendMessage', options )
        .then(res => {
            nameInput.style.display = 'none';
            phoneInput.style.display = 'none';
            messageInput.style.display = 'none';
            submitButton.style.display = 'none';
            chatBubble.style.display = 'none';
            disclaimer.style.display = 'none';
            var successIcon = document.createElement('img');
            successIcon.src = 'https://cdn3.iconfinder.com/data/icons/basicolor-arrows-checks/24/149_check_ok-512.png';
            successIcon.style.width = '60px';
            successIcon.style.height = '60px';
            successIcon.style.position = 'absolute';
            successIcon.style.bottom = '20%';
            successIcon.style.left = '50%';
            successIcon.style.transform = 'translate(-50%, -50%)';
            var successMessage = document.createElement('a');
            successMessage.innerHTML = settings?.success_message?.text || "Message sent successfully! We will get back to you shortly via SMS.";
            successMessage.href = settings?.success_message?.link;
            successMessage.style.fontSize = "14px";
            successMessage.style.color = color;
            successMessage.target = "_blank";
            successMessage.style.textAlign = "center";
            chatBubbleForm.appendChild(successIcon);
            chatBubbleForm.appendChild(successMessage);
        })
        .catch(err => {
            console.log(err);
            nameInput.style.display = 'none';
            phoneInput.style.display = 'none';
            messageInput.style.display = 'none';
            submitButton.style.display = 'none';
            chatBubble.style.display = 'none';
            disclaimer.style.display = 'none';
            var errorIcon = document.createElement('img');
            errorIcon.src = 'https://cdn0.iconfinder.com/data/icons/shift-interfaces/32/Error-512.png';
            errorIcon.style.width = "50px";
            errorIcon.style.height = "50px";
            errorIcon.style.position = "absolute";
            errorIcon.style.top = "50%";
            errorIcon.style.left = "50%";
            errorIcon.style.transform = 'translate(-50%, -50%)';
            chatBubbleForm.appendChild(errorIcon);
        })

    };
    var chatBoxFooter = document.createElement('div');
    chatBoxFooter.style.width = '100%';
    chatBoxFooter.style.height = '40px';
    chatBoxFooter.style.backgroundColor = color;
    chatBoxFooter.style.borderBottomLeftRadius = '5px';
    chatBoxFooter.style.borderBottomRightRadius = '5px';
    chatBoxFooter.style.textAlign = 'center';
    chatBoxFooter.style.lineHeight = '40px';

    chatBox.appendChild(chatBoxFooter);
    /* fix the footer to the bottom of the chatbox */
    chatBoxFooter.style.position = 'absolute';
    chatBoxFooter.style.bottom = '0px';
    var footerLogo = document.createElement('img');
    footerLogo.src = settings?.logo || 'https://res.cloudinary.com/crunchbase-production/image/upload/c_lpad,f_auto,q_auto:eco,dpr_1/wp7tiawrmvcj5swxlczc';
    footerLogo.style.position = 'absolute';
    footerLogo.style.top = '50%';
    footerLogo.style.left = '50%';
    footerLogo.style.borderRadius = "50%";
    footerLogo.style.transform = 'translate(-50%, -50%)';
    chatBoxFooter.appendChild(footerLogo);
    /* Put the footer logo on the left and make it object cover */
    footerLogo.style.right = '20px';
    footerLogo.style.objectFit = 'contain';
    /* Make the smaller and have it showing entirely */
    footerLogo.style.width = '30px';
    footerLogo.style.height = '30px';
    var disclaimer = document.createElement('div');
    disclaimer.innerHTML = `By submitting, you authorize ${settings?.disclaimer_name} to send text messages with offers & other information, possibly using automated technology, to the number you provided. Message/data rates apply. Consent is not a condition of purchase.`;
    disclaimer.style.position = 'absolute';
    disclaimer.style.bottom = '50px';
    disclaimer.style.textAlign = 'center';
    disclaimer.style.padding = '10px';
    disclaimer.style.fontSize = '10px';
    disclaimer.style.color = 'black';
    var publicLink = document.createElement('div');
    publicLink.innerHTML = "Public Profile";
    chatBox.appendChild(disclaimer);
    // chatBox.append(publicLink);
});