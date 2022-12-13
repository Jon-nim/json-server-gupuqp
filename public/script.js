$(document).ready(() => {
  $('button[data-cy="add_log_btn"]').prop('disabled', true);
  fetchCourseData();
  $(document).on('change', '#course', unhide);
  $(document).on('keyup', '#uvuId', cleantext);
  $(document).on('keyup', '#uvuId', fetchUVUData);
  $(document).on('submit', '#form', postUVUdata);
});

//unhides when a course is selected
function unhide(event) {
  if ($('#course').val() == '') {
    $('#uvuId').css('display', 'none');
  } else {
    $('#uvuId').css('display', 'block');
  }
}

function cleantext(event) {
  if (isNaN($('#uvuId').val().slice(-1))) {
    $('#uvuId').val(
      $('#uvuId')
        .val()
        .slice(0, $('#uvuId').val().length - 1)
    );
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
  let url = `http://localhost:3000/api/v1/courses`;

  // Set uvuId search bar placeholder here
  $('#uvuId').attr('placeholder', '10234567');

  // Get request for courses
  axios
    .get(url)
    .then((text) => {
      text = text.data;
      //parse the text from response
      //text = JSON.parse(text);
      //set the options
      let html = '<option selected value="">Choose Courses</option>\n';
      for (i of text) {
        html += `<option value="${i.id}">${i.display}</option>\n`;
      }
      //paste to innerhtml
      $('#course').html(html);
    })
    .catch((err) => console.log(err));
}

function fetchUVUData(event) {
  //define variables
  const uvuId = $('#uvuId').val();
  const corseId = $('#course').val();

  const studentLogs = document.querySelector('ul[data-cy="logs"]');
  let html = '';

  if ($('#uvuId').val().length == 8) {
    // get request for logs with specified uvuid and courseId
    let url = `http://localhost:3000/api/v1/logs?uvuId=${uvuId}&courseId=${corseId}`;

    axios
      .get(url)
      .then((text) => {
        text = text.data;
        //once it passes prints the specified student Logs for uvu id
        $('#uvuIdDisplay').html(`Student Logs for ${uvuId}`);
        for (i of text) {
          html += `<li onclick="hideComment(this)">
                <div><small>${i.date}</small></div>
                <pre><p class="logCommentSelector">${i.text}</p></pre>
              </li>`;
        }
        studentLogs.innerHTML = html;
        $('button[data-cy="add_log_btn"]').prop('disabled', false);
      })
      .catch((err) => console.log(err));
  }
}

function postUVUdata(event) {
  event.preventDefault();
  const uvuId = $('#uvuId').val();
  const courseId = $('#course').val();
  const postlogs = $('#textareaLog').val();
  let date = new Date();
  date = date.toLocaleString();
  const id = createUUID();
  let params = {
    courseId: courseId,
    uvuId: uvuId,
    date: date,
    text: postlogs,
    id: id,
  };

  let url = `http://localhost:3000/api/v1/logs`;
  axios.post(url, params).then(function (response) {
    console.log(response);
    $('#textareaLog').val('');
    fetchUVUData();
    $('button[data-cy="add_log_btn"]').prop('disabled', true);
  });
}

function createUUID() {
  return 'xxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
