const fadeAnimationDuration = 200;
let globalIDstorage;

let globalQuestID;
document.addEventListener('DOMContentLoaded', (event) => {
    //Edit to use multiple custom select boxes
    document.querySelector('.modal .select-wrapper').addEventListener('click', function () {
        this.querySelector('.select').classList.toggle('open');
    })
    document.querySelector('.editQuestModal .select-wrapper').addEventListener('click', function () {
        this.querySelector('.select').classList.toggle('open');
    })

    for (const option of document.querySelectorAll(".custom-option")) {
        option.addEventListener('click', function () {
            if (!this.classList.contains('selected')) {
                this.parentNode.querySelector('.custom-option.selected')?.classList.remove('selected');
                this.classList.add('selected');
                this.parentNode.parentNode.querySelector('.select_trigger span').textContent = this.textContent.replace('|', '').trim();
                checkIfFormIsReady(this, this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('input[type="text"]'), this.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('textarea'));
            }
        })
    }

    window.addEventListener('click', function (e) {
        const select = document.querySelector('.select')
        if (!select.contains(e.target)) {
            select.classList.remove('open');
        }
    });

    document.getElementById('quest_description').addEventListener('input', () => {
        text = document.getElementById('quest_description').value;
        document.getElementById('quest_description').value = text.charAt(0).toUpperCase() + text.slice(1);
    });

    function handleDragStart(e) {
        this.style.opacity = '0.4';

        document.getElementById("completedQuestsBox").style.pointerEvents = "all";
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.id);
        globalIDstorage = e.target.id;
        globalQuestID = e.target.id;
        // console.log(globalQuestID)
    }

    function handleDragEnd(e) {
        // Does not get executed right now, due to new modal showing
        // TODO add this to statusChangedQuest()
    }

    function handleDragOver(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }
        return false;
    }

    function handleDragEnter(e) {
        if (this !== document.getElementById("uncompletedQuestsBox")) {
            this.classList.add('over');
        }
    }

    function handleDragLeave(e) {
        if (this.classList.contains('over')) {
            this.classList.remove('over');
        }
    }
    function handleDrop(e) {
        e.stopPropagation();
        let draggedElement = document.getElementById(globalIDstorage)

        if (draggedElement !== this) {
            if (this === document.getElementById("uncompletedQuestsBox")) {
                // draggedElement.classList.add("quest")
                // this.insertBefore(draggedElement, document.getElementById("addNewQuestDiv"));
            } else {
                document.querySelector('input[action="status"]').checked = true;
            }
            questBoxes.forEach(function (item) {
                item.classList.remove('over');
            });
        }
        return false;
    }
    let quests = document.querySelectorAll('#uncompletedQuestsBox .questDiv.quest');
    quests.forEach(function (quest) {
        if (quest.querySelector('span.description')) {
            quest.classList.add('expandable');
            let currentHeight = quest.getBoundingClientRect().height - 4;
            if (quest.querySelector('span.description').offsetHeight > 23) {
                quest.querySelector('p.title').appendChild(createChevronIcon())
            }
            quest.addEventListener("mouseover", function (event) {
                if (quest.querySelector('i.fas.fa-chevron-up')) {
                    quest.style.minHeight = `${currentHeight + quest.querySelector('span.description').offsetHeight - 21}px`;
                    quest.querySelector('i.fas.fa-chevron-up').classList.add('rotateChevron')
                }
            }, false);
            quest.addEventListener("mouseleave", function (event) {
                if (quest.querySelector('i.fas.fa-chevron-up')) {
                    quest.style.minHeight = "50px";
                    quest.querySelector('i.fas.fa-chevron-up').classList.remove('rotateChevron')
                }
            }, false);

        } else {
            quest.classList.add('onlyTitle');
        }
        quest.setAttribute('draggable', 'true');
        quest.addEventListener('dragstart', handleDragStart);
        quest.addEventListener('dragend', handleDragEnd);
    });

    let questBoxes = document.querySelectorAll('.questBox');
    questBoxes.forEach(function (questBox) {
        questBox.addEventListener('dragover', handleDragOver);
        questBox.addEventListener('dragenter', handleDragEnter);
        questBox.addEventListener('dragleave', handleDragLeave);
        questBox.addEventListener('drop', handleDrop);
    });

    document.getElementById('sortingIcon').addEventListener('click', function (e) {

        let sortingIcon = document.getElementById('sortingIcon')
        sortingIcon.classList.toggle('desc');

        let correctQuestBox = sortingIcon.parentNode.parentNode.nextSibling;
        let questsToSort = correctQuestBox.querySelectorAll('.questDiv.quest');

        let questToSortArray = Array.prototype.slice.call(questsToSort, 0);


        // Remove Quests
        questsToSort.forEach(quest => {
            quest.style.animationName = 'fadeOut';
            setTimeout(() => {
                quest.remove();
            }, fadeAnimationDuration)

        });
        setTimeout(() => {
            questToSortArray.reverse();

            // Add Sorted Quests
            questToSortArray.forEach(quest => {
                correctQuestBox.insertBefore(quest, correctQuestBox.querySelector('.addNewQuest'))
            })
            correctQuestBox.querySelectorAll('.questDiv.quest').forEach(quest => {
                quest.style.animationName = 'fadeIn';
            })
        }, fadeAnimationDuration)

    })
});

function createCompleteIcon() {
    // <i class="far fa-check-circle"></i>
    let completedIcon = document.createElement("i");
    completedIcon.classList = 'far fa-check-circle';
    completedIcon.style.color = "lightgreen";
    completedIcon.style.width = "16px";
    completedIcon.style.height = "16px";
    return completedIcon;
}

function createFailedIcon() {
    // <i class="fas fa-times"></i>
    let failedIcon = document.createElement("i");
    failedIcon.classList = 'fas fa-times';
    failedIcon.style.color = "red";
    failedIcon.style.width = "16px";
    failedIcon.style.height = "16px";
    return failedIcon;
}

function createExpiredIcon() {
    // <i class="far fa-clock"></i>
    let expiredIcon = document.createElement("i");
    expiredIcon.classList = 'far fa-clock';
    expiredIcon.style.color = "orange";
    expiredIcon.style.width = "16px";
    expiredIcon.style.height = "16px";
    return expiredIcon;
}

function createChevronIcon() {
    // <i class="far fa-clock"></i>
    let chevronIcon = document.createElement("i");
    chevronIcon.classList = 'fas fa-chevron-up';
    return chevronIcon;
}

function sortingChanged(sortingSelector) {
    //TODO: Apply same thing as with sortingIcon (fadeIn and Out)
    let sortingMethod = sortingSelector.value;

    let correctQuestBox = sortingSelector.parentNode.parentNode.nextSibling;
    let questsToSort = correctQuestBox.querySelectorAll('.questDiv.quest');

    let questToSortArray = Array.prototype.slice.call(questsToSort, 0);

    if (sortingMethod === "importance") {
        //Importance Value
        questToSortArray.sort(function (a, b) {
            a = a.attributes[2].nodeValue.valueOf()
            b = b.attributes[2].nodeValue.valueOf()
            return a - b;
        })
    } else if (sortingMethod === "started") {
        //Start Date Value
        questToSortArray.sort(function (a, b) {
            a = new Date(a.attributes[3].nodeValue).valueOf()
            b = new Date(b.attributes[3].nodeValue).valueOf()
            return a - b;
        })
    } else if (sortingMethod === "alphabetical") {
        //Start Date Value
        questToSortArray.sort(function (a, b) {
            if (a.querySelector('p.title').childNodes[0].textContent.trim() < b.querySelector('p.title').childNodes[0].textContent.trim()) { return -1; }
            if (a.querySelector('p.title').childNodes[0].textContent.trim() > b.querySelector('p.title').childNodes[0].textContent.trim()) { return 1; }
            return 0;
        })
    }



    if (document.getElementById('sortingIcon').classList.contains('desc')) {
        questToSortArray.reverse();
    }



    // Remove Quests
    questsToSort.forEach(quest => {
        quest.style.animationName = 'fadeOut';
        setTimeout(() => {
            quest.remove();
        }, fadeAnimationDuration)

    });
    setTimeout(() => {
        questToSortArray.reverse();

        // Add Sorted Quests
        questToSortArray.forEach(quest => {
            correctQuestBox.insertBefore(quest, correctQuestBox.querySelector('.addNewQuest'))
        })
        correctQuestBox.querySelectorAll('.questDiv.quest').forEach(quest => {
            quest.style.animationName = 'fadeIn';
        })
    }, fadeAnimationDuration)
}

function searchQuest(searchBar) {
    let searchValue = searchBar.value.toLowerCase();
    let correctQuestBox = searchBar.parentNode.nextSibling;
    let questsToSort = correctQuestBox.querySelectorAll('.questDiv.quest');

    let filteredQuests = Array.prototype.slice.call(questsToSort).filter(quest => quest.querySelector('p.title').childNodes[0].textContent.trim().toLowerCase().includes(searchValue) || quest.querySelector('span.description')?.innerHTML.toLowerCase().includes(searchValue));

    // Hide Other Quests
    questsToSort.forEach(quest => {
        quest.style.display = 'none';
        if (filteredQuests.includes(quest)) {
            quest.style.display = 'flex';
        }
    })
}

function updateInput(input) {
    let characterCountElement = input.parentNode.querySelector('p.characterCount');
    // let maxCharacterCount = parseInt(input.parentNode.querySelector('p.maxCharacterCount').innerText);

    characterCountElement.innerText = input.value.length;

    checkIfFormIsReady(input.parentNode.parentNode.querySelector('.custom-option.selected'), input.parentNode.parentNode.querySelector('input[type="text"]'), input.parentNode.parentNode.querySelector('textarea'));

}


function checkIfFormIsReady(priorityElement, titleElement, descriptionElement) {
    // console.log()
    let priority = priorityElement?.getAttribute('data-value');
    let title = titleElement.value?.trim();
    let description = descriptionElement.value?.trim();

    if ((priority != undefined && priority != null) && (title != undefined && title != null && title !== '')) {
        titleElement.parentNode.parentNode.querySelector('input[type="button"]').removeAttribute('disabled');
    } else {
        titleElement.parentNode.parentNode.querySelector('input[type="button"]').setAttribute('disabled', 'true');
    }
}

function createQuest(buttonElement) {
    let priority = document.querySelector('.modal .custom-option.selected')?.getAttribute('data-value');
    let title = document.getElementById('quest_title')?.value?.trim();
    let description = document.getElementById('quest_description')?.value?.trim();

    buttonElement.value = '';
    document.querySelector(`.createButton>i.fa-spinner`).classList.add('active')
    buttonElement.setAttribute('disabled', 'true')

    // console.log(`Clicking "Create"-button`)
    setTimeout(() => {
        try {
            axios.post(`/dashboard/${guildID}/informational/quests`, {
                "priority": priority,
                "title": title,
                "description": description,
            }).then(response => {
                if (response.status === 200) {
                    document.querySelector(`input[action="create"]`).checked = false;

                    // Reset createQuestModal
                    let selectDiv = document.querySelector(`#addNewQuestDiv .select`)
                    selectDiv.querySelector(`.custom-option.selected`).classList.remove('selected');
                    selectDiv.querySelector(`#quest_priority`).textContent = 'Select a priority';
                    
                    document.querySelector(`#quest_title`).value = '';
                    updateInput(document.querySelector(`#quest_title`))
                    
                    document.querySelector(`#quest_description`).value = '';
                    updateInput(document.querySelector(`#quest_description`))



                    let uncompletedQuestsBox = document.querySelector('.questBox[id="uncompletedQuestsBox"]');
                    uncompletedQuestsBox.insertBefore(createQuestDiv(response.data.data), uncompletedQuestsBox.childNodes[uncompletedQuestsBox.childNodes.length -1])     
                    
                    let uncompletedQuestCountElement = document.querySelector(`#uncompletedQuestsCount`);
                    uncompletedQuestCountElement.textContent = parseInt(uncompletedQuestCountElement.textContent) + 1;

                    pushNotify('success', 'Quest created', 'The quest has been successfully created.');
                } else {
                    console.log("Something went wrong!; ERROR STATUS: " + response.status);
                }
            })
        } catch (error) {
            console.log("error occured during create");
        };
        buttonElement.value = 'Create';
        document.querySelector(`.createButton>i.fa-spinner`).classList.remove('active')
        buttonElement.removeAttribute('disabled')

    }, 250);

}

function createQuestDiv(quest_data){
    // console.log(quest_data)
    let questDiv = document.createElement('div');
    questDiv.classList.add('questDiv', 'quest');
    questDiv.setAttribute('id', quest_data.quest_identifier);
    questDiv.setAttribute('quest_importance_value', quest_data.quest_importance_value);
    questDiv.setAttribute('quest_started', quest_data.createdAt);
    questDiv.setAttribute('draggable', 'true');


    let questTitleDiv = document.createElement('div');
    questTitleDiv.classList.add('questTitleDiv');
    questDiv.appendChild(questTitleDiv);
    
    let questTitleP = document.createElement('p');
    questTitleP.classList.add('title');
    questTitleP.textContent = quest_data.quest_name;
    questTitleDiv.appendChild(questTitleP);


    let questDescriptionSpan = document.createElement('span'); 
    questDescriptionSpan.classList.add('description');
    questDescriptionSpan.textContent = quest_data.quest_description;
    quest_data.quest_description ? questTitleDiv.appendChild(questDescriptionSpan) : questDiv.classList.add('onlyTitle');


    let optionsDiv = document.createElement('div');
    optionsDiv.classList.add('options');
    questDiv.appendChild(optionsDiv);

    let deleteLabel = document.createElement('label');
    deleteLabel.classList.add('trash-label');
    deleteLabel.setAttribute('action', 'delete');
    deleteLabel.setAttribute('for', 'deleteQuestModal');
    deleteLabel.setAttribute('onclick', 'updateGlobalQuestId(this)');
    optionsDiv.appendChild(deleteLabel);

    let editLabel = document.createElement('label');
    editLabel.classList.add('edit-label');
    editLabel.setAttribute('action', 'edit');
    editLabel.setAttribute('for', 'editQuestModal');
    editLabel.setAttribute('onclick', 'updateGlobalQuestId(this)');
    optionsDiv.appendChild(editLabel);

    let trashIcon = document.createElement('i');
    trashIcon.classList.add('fas', 'fa-trash');
    deleteLabel.appendChild(trashIcon);

    let editIcon = document.createElement('i');
    editIcon.classList.add('fas', 'fa-edit');
    editLabel.appendChild(editIcon);


    return questDiv;
}

function editQuest(buttonElement) {
    let questElement = document.querySelector(`.quest[id="${globalQuestID}"]`);

    let priority = document.querySelector('.editQuestModal .custom-option.selected')?.getAttribute('data-value');
    let title = document.getElementById('edit_quest_title')?.value?.trim();
    let description = document.getElementById('edit_quest_description')?.value?.trim();

    buttonElement.value = '';
    document.querySelector(`.editButton>i.fa-spinner`).classList.add('active')
    buttonElement.setAttribute('disabled', 'true')

    setTimeout(() => {
        try {
            axios.put(`/dashboard/${guildID}/informational/quests`, {
                "quest_id": questElement.getAttribute('id'),
                "priority": priority,
                "title": title,
                "description": description
            }).then(response => {
                if (response.status === 201) {
                    document.querySelector(`input[action="edit"]`).checked = false;
                    questElement.querySelector(`p.title`).textContent = title;
                    questElement.querySelector(`span.description`).textContent = description;
                    questElement.setAttribute('quest_importance_value', priority);
                    pushNotify('success', 'Quest edited', 'The quest has been edited successfully.');
                }
            })
        } catch (error) {
            console.log("error occured during edit of quest: " + globalQuestID);
        };
        document.querySelector(`.editButton>i.fa-spinner`).classList.remove('active')
        buttonElement.removeAttribute('disabled')
        buttonElement.value = 'Edit';

    }, 250);
}

function deleteQuest(buttonElement) {
    let questElement = document.querySelector(`.quest[id="${globalQuestID}"]`);

    buttonElement.value = '';
    document.querySelector(`.deleteButton>i.fa-spinner`).classList.add('active')
    buttonElement.setAttribute('disabled', 'true')

    setTimeout(() => {
        try {
            axios.delete(`/dashboard/${guildID}/informational/quests`, { data: { 'quest_id': globalQuestID } }).then(response => {
                if (response.status === 201) {
                    document.querySelector(`input[action="delete"]`).checked = false;
                    questElement.remove();
                    uncompletedQuestsCount.innerText = uncompletedQuestsCount.innerText - 1;
                    pushNotify('success', 'Quest removed', 'The quest has been removed successfully.');
                }
            })
        } catch (error) {
            console.log("error occured during delete");
        };
        buttonElement.value = 'Delete';
        document.querySelector(`.deleteButton>i.fa-spinner`).classList.remove('active')
        buttonElement.removeAttribute('disabled')


    }, 250);
}

async function statusChangeQuest(buttonValue) {
    let possibleOutcomes = ["done", "expired", "failed"]
    if (!possibleOutcomes.includes(buttonValue.toLowerCase())) console.log("Not in here");
    // console.log(globalQuestID)
    setTimeout(() => {
        try {
            axios.put(`/dashboard/${guildID}/informational/quests`, { 'quest_id': globalQuestID, 'status': buttonValue.toUpperCase() }).then(response => {
                if (response.status === 201) {
                    // questElement.remove();
                    // uncompletedQuestsCount.innerText = uncompletedQuestsCount.innerText - 1;
                    window.location = './quests';
                }
            })
        } catch (error) {
            console.log(error)
            console.log("error occured during status update");
        };
    }, 250);
}

async function updateGlobalQuestId(iconElement) {
    let questElement = iconElement.parentNode.parentNode;
    globalQuestID = questElement.getAttribute('id');
    let quest_title = document.querySelector(`.quest[id="${globalQuestID}"] .questTitleDiv p.title`).textContent.split('started')[0]
    let quest_description = document.querySelector(`.quest[id="${globalQuestID}"] .questTitleDiv span.description`)?.textContent || '';
    // console.log(document.querySelector(`.quest[id="${globalQuestID}"] .questTitleDiv p.title span.description`))
    if (iconElement.className.includes('trash')) {
        // console.log(`Delete "${document.querySelector(`.quest[id="${globalQuestID}"] .questTitleDiv p.title`).textContent.split('started')[0]}"?`)
        document.querySelector('p.questDeleteTitle').textContent = `Delete "${quest_title}"?`;
    } else if (iconElement.className.includes('edit')) {
        document.querySelector('input[id="edit_quest_title"]').value = quest_title;
        document.querySelector('textarea[id="edit_quest_description"]').value = quest_description;
        document.querySelector(`.editQuestModal .custom-option[data-value="${document.querySelector(`.quest[id="${globalQuestID}"]`).getAttribute("quest_importance_value")}"]`).classList.add('selected')
        document.querySelector('.editQuestModal .select_trigger span').textContent = document.querySelector(`.editQuestModal .custom-option[data-value="${document.querySelector(`.quest[id="${globalQuestID}"]`).getAttribute("quest_importance_value")}"]`).textContent.replace('|', '').trim();

        // console.log(document.querySelector('input[id="edit_quest_title"]'))
    }
}