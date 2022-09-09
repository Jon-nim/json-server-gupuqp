//it was not specified that add log should fire ajax request to database.

let courseSelect = document.getElementById('course');
let uvuIdSearch = document.getElementById('uvuId');
courseSelect.addEventListener('change', unhide);
uvuIdSearch.addEventListener('keyup', cleantext);
uvuIdSearch.addEventListener('keyup', fetchUVUData);
document.querySelector('button[data-cy="add_log_btn"]').disabled = true;

//unhides when a course is selected
function unhide(event) {
  if (courseSelect.value == '') {
    uvuIdSearch.style.display = 'none';
  } else {
    uvuIdSearch.style.display = 'block';
  }
}

function cleantext(event) {
  if (isNaN(uvuIdSearch.value.slice(-1))) {
    uvuIdSearch.value = uvuIdSearch.value.slice(
      0,
      uvuIdSearch.value.length - 1
    );
  }
  if (uvuIdSearch.value.length > 8) {
    uvuIdSearch.value = uvuIdSearch.value.slice(0, 8);
  }
}

function hideComment(element) {
  //this hides comments for the studentlogs
  if (element.lastElementChild.style.display == 'none')
    element.lastElementChild.style.display = 'block';
  else element.lastElementChild.style.display = 'none';
}

function fetchCourseData(event) {
  // URL for the database, specifying courses
  let url = `https://json-server-1msk9r--3000.local.webcontainer.io/api/v1/courses`;

  // Set uvuId search bar placeholder here
  uvuIdSearch.setAttribute('placeholder', '10234567');

  // Get request for courses
  axios
    .get(url)
    .then((response) => {
      response.text().then((text) => {
        console.log('here!');
        //parse the text from response
        //text = JSON.parse(text);
        //set the options
        let html = '<option selected value="">Choose Courses</option>\n';
        for (i of text) {
          html += `<option value="${i.id}">${i.display}</option>\n`;
        }
        //paste to innerhtml
        courseSelect.innerHTML = html;
      });
    })
    .catch((err) => console.log(err));
}

function fetchUVUData(event) {
  //define variables
  const uvuId = uvuIdSearch.value;
  const corseId = courseSelect.value;
  const studentLogs = document.querySelector('ul[data-cy="logs"]');
  let html = '';

  if (uvuIdSearch.value.length == 8) {
    // get request for logs with specified uvuid and courseId
    let url = `https://json-server-gupuqp--3000.local.webcontainer.io/api/v1/logs?uvuId=${uvuId}&courseId=${corseId}`;

    fetch(url, { method: 'GET' })
      .then((response) => {
        response.text().then((text) => {
          text = JSON.parse(text);
          //once it passes prints the specified student Logs for uvu id
          document.getElementById(
            'uvuIdDisplay'
          ).innerHTML = `Student Logs for ${uvuId}`;
          for (i of text) {
            html += `<li onclick="hideComment(this)">
                <div><small>${i.date}</small></div>
                <pre><p class="logCommentSelector">${i.text}</p></pre>
              </li>`;
          }
          studentLogs.innerHTML = html;
          document.querySelector(
            'button[data-cy="add_log_btn"]'
          ).disabled = false;
        });
      })
      .catch((err) => console.log(err));
  }
}

//called on loadup so that data will be there
fetchCourseData();
