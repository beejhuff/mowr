/* http://stackoverflow.com/questions/3257277/jquery-get-post-data */
function redirect_by_post(purl, pparameters, in_new_tab) {
    pparameters = (typeof pparameters == 'undefined') ? {} : pparameters;
    in_new_tab = (typeof in_new_tab == 'undefined') ? true : in_new_tab;

    var form = document.createElement("form");
    $(form).attr("id", "reg-form").attr("name", "reg-form").attr("action", purl).attr("method", "post").attr("enctype", "multipart/form-data");
    if (in_new_tab) {
        $(form).attr("target", "_blank");
    }
    $.each(pparameters, function (key) {
        $(form).append('<input type="text" name="' + key + '" value="' + this + '" />');
    });
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    return false;
}


function hashFile() {
    var input_file = $("#dropzone-file")[0];
    var file = input_file.files[0];
    var filename = input_file.value.split(/[\\\/]/g).pop();

    var reader = new FileReader();

    reader.onload = function () {
        var sha256 = CryptoJS.SHA256(reader.result);
        var type = $("#select_type")[0].value;
        $.ajax({
            url: '/sample/' + type + '/' + sha256, success: function (result) {
                if (result === "NOK") {
                    // Upload the file
                    $("#dropzone").submit();
                } else {
                    // Do not upload the file but post filename
                    redirect_by_post('/choose/' + type + '/' + sha256, {filename: filename}, false)
                }
            }
        })
    };

    reader.onerror = function () {
        console.error("Could not read the file.");
    };

    reader.readAsBinaryString(file)
}

function vote(sha256, type) {
    var vote_div = $("#vote");
    var buttons = vote_div.find("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = "disabled";
    }

    $.ajax({
        url: "/vote/" + sha256 + "/" + type, success: function (result) {
            if (result === "OK") {
                if (type == 'clean') {
                    n = 1;
                } else {
                    n = -1;
                }
                // gauge is already set if we are on the right page
                gauge.set(gauge.value + n);
            }
        }
    })
}

function showTagForm() {
    $("#tagform")[0].hidden = null;
}

function hideTagForm() {
    $("#tagform")[0].hidden = 'hidden';
}

function submitTag() {
    var tag = $("#tagtoadd")[0].value;
    var sha256 = $("#sha256")[0].innerHTML;

    $.ajax({
        url: "/tag/submit/" + sha256 + "/" + tag + "/format", success: function (result) {
            if (result != "NOK") {
                var t = $("#tagtoadd")[0];
                t.remove(t.selectedIndex);
                $("#tags")[0].innerHTML += result + ' ';
                hideTagForm();
            }
        }
    })
}

