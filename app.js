document.addEventListener('DOMContentLoaded', () => {

  // load guest list function 
  const loadGuestList = () => JSON.parse(localStorage.getItem('GuestList'));


  // Variable declarations
  const form = document.getElementById('registrar');
  const input = form.querySelector('input');
  
  const mainDiv = document.querySelector('.main');
  const ul = document.getElementById('invitedList');
  
  const div = document.createElement('div');
  const filterLabel = document.createElement('label');
  const filterCheckBox = document.createElement('input');
  const guestList = loadGuestList() || [];
  let currentName;
  
  filterLabel.textContent = "Hide those who haven't responded";
  filterCheckBox.type = 'checkbox';
  div.appendChild(filterLabel);
  div.appendChild(filterCheckBox);
  mainDiv.insertBefore(div, ul);

  // Filter guest Event listener
  filterCheckBox.addEventListener('change', (e) => {
    const isChecked = e.target.checked;
    const lis = ul.children;

    if(isChecked) {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        if (li.className === 'responded') {
          li.style.display = '';  
          li.querySelector('label').style.display = 'none';
        } else {
          li.style.display = 'none';      
        }
      }
    } else {
      for (let i = 0; i < lis.length; i += 1) {
        let li = lis[i];
        li.style.display = '';
        li.querySelector('label').style.display = '';
      }                                 
    }
  });
  
  // Create lits items to contain names of invted guest.
  const createLI = (text) => {
    const createElement = (elementName, property, value) => {
      const element = document.createElement(elementName);  
      element[property] = value; 
      return element;
    }
    
    // add items to an unurderd list
    const appendToLI = (elementName, property, value) => {
      const element = createElement(elementName, property, value);     
      li.appendChild(element); 
      return element;
    }
    
    const li = document.createElement('li');
    appendToLI('span', 'textContent', text);     
    appendToLI('label', 'textContent', 'Confirm')
      .appendChild(createElement('input', 'type', 'checkbox'));
    appendToLI('button', 'textContent', 'edit');
    appendToLI('button', 'textContent', 'remove');
    return li;
  }

  const saveGuestList = (guestList) => {
    localStorage.setItem("GuestList", JSON.stringify(guestList));
  }

  // load guest list from local storage
  const list = loadGuestList();
  if (list !== null){
    for(let i = 0; i < list.length; i++){
      const li = createLI(list[i])
      ul.appendChild(li);
    }
  }

  // Submit form Event listener
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value;
    if (text.trim() === ''){
      alert('Please enter a name!');
    } else {
      if(guestList.includes(text)){
        alert('Guest name already exisits');
        return false;
      }{
        input.value = '';
        const li = createLI(text);
        guestList.push(text)
        saveGuestList(guestList)
        ul.appendChild(li);
      }
    }
  });

  // Confirm Event listener
  ul.addEventListener('change', (e) => {
    const checkbox = event.target;
    const checkBoxParent = checkbox.parentElement;
    const checkLabel = checkBoxParent.firstChild;
    const checked = checkbox.checked;
    const listItem = checkbox.parentNode.parentNode;

    if (checked) {
      listItem.className = 'responded';
      checkLabel.nodeValue = 'Confirmed';
    } else {
      listItem.className = '';
      checkLabel.nodeValue = 'Confirm';
    }
  });
    
  // Butten Event listener: [Edit, Save, Remove] buttons.
  ul.addEventListener('click', (e) => {

    if (e.target.tagName === 'BUTTON') {
      const button = e.target;
      const li = button.parentNode;
      const ul = li.parentNode;
      const action = button.textContent;
      const child = li.firstElementChild;
      const inputData = child.textContent || child.value;

      const nameActions = {
        remove: () => {
          const guestList = loadGuestList();
          const removeName = li.firstElementChild.textContent;
          const newList = guestList.filter(name => name !== removeName);
          saveGuestList(newList);
          ul.removeChild(li);
        },
        edit: () => {
          const input = document.createElement('input');
          input.type = 'text';
          input.value = inputData;
          li.insertBefore(input, child);
          li.removeChild(child);
          button.textContent = 'save';
          currentName = inputData;
        },
        save: () => {
          const input = li.firstElementChild;
          const inputValue = input.value;       
          if (inputValue.trim() === ''){
            alert('Please enter a name!')
          } else {
            const child = document.createElement('span');
            const index = guestList.indexOf(currentName)
            child.textContent = inputValue
            guestList.splice(index, 1, inputValue);
            console.log(guestList)
            saveGuestList(guestList);
            li.insertBefore(child, input);
            li.removeChild(input);
            button.textContent = 'edit';    
          }    
        }
      };
      
      // select and run action in button's name
      nameActions[action]();
    }
  });  

});  
