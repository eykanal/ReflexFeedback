/*
    
Reflex Feedback v0.3
AJAX, JQuery UI widget for user feedback

Copyright (c) 2010-2011, Avishkar Autar
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
* Redistributions of source code must retain the above copyright
notice, this list of conditions and the following disclaimer.
* Redistributions in binary form must reproduce the above copyright
notice, this list of conditions and the following disclaimer in the
documentation and/or other materials provided with the distribution.
* The name of the author may not be used to endorse or promote products
derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.


CHANGES

v0.3
+ Design tweaks (border, box-shadow, border-radius on textarea; padding-top on copyright)
+ widgetPos argument added to init(), valid values => 'left', 'right'


*/


var Reflex = {}

Reflex.version = 0.3;
Reflex.feedbackType = 'idea';
Reflex.txtAreaHasDefault = true;
Reflex.curDefaultTxt = '';
Reflex.feedbackPostUrl = 'test.php';
Reflex.ghostTxtColor = '#999';
Reflex.widgetPos = 'left';

Reflex.sendFeedback = function (feedbackType, feedbackTxt)
{
    $.ajax({
        type: 'POST',
        url: Reflex.feedbackPostUrl,
        data: "feedback_type=" + feedbackType + "&feedback_txt=" + feedbackTxt,
        success: function (data)
        {
            var result = $('result', data).text();
            if (result != 'ok') {
                Reflex.onSendFailure();
            }
            else {
                Reflex.onSendSuccess();
            }
        },
        error: function (xhr, textStatus, errorThrown)
        {
            Reflex.onSendFailure();
        }
    });
}

Reflex.onSendSuccess = function ()
{
    $('#reflex-feedback-dialog').dialog('enable');
    $('#reflex-feedback-dialog').dialog('close');
    $('#reflex-feedback-send-success-dialog').dialog({ title: 'Thank you!' }, { width: 400 }, { modal: true }, { resizable: false }, { draggable: true }, 
    { buttons: { "OK": function ()
    {
        $('#reflex-feedback-send-success-dialog').dialog('close');
    }
    }
    });
}

Reflex.onSendFailure = function ()
{
    $('#reflex-feedback-dialog').dialog('enable');
    $('#reflex-feedback-send-failure-msg').show();
    $('#reflex-feedback-dialog-entry-area-submitsec .reflex-feedback-sending-msg').hide();

    
}

Reflex.showDialog = function ()
{
    $('#reflex-feedback-dialog').dialog({ title: 'Feedback...' }, { width: 640 }, { modal: true }, { resizable: false }, { draggable: true },
                                        { beforeClose: function (event, ui)
                                        {
                                            Reflex.txtAreaHasDefault = true;
                                            Reflex.menuIdeaSelect();
                                            $("#reflex-feedback-dialog-entry-area button").unbind();
                                            $('#reflex-feedback-dialog-entry-area-txt').unbind();
                                            $('#reflex-feedback-dialog-entry-area-submitsec .reflex-feedback-sending-msg').hide();
                                        }
                                        },
			        					{ open: function (event, ui)
			        					{

			        					    $('#reflex-feedback-send-failure-msg').hide();
			        					    $('#reflex-feedback-dialog-entry-area-submitsec .reflex-feedback-sending-msg').hide();

			        					    $('#reflex-feedback-dialog-entry-area-txt').focusin(function ()
			        					    {
			        					        if (Reflex.txtAreaHasDefault) {
			        					            $('#reflex-feedback-dialog-entry-area-txt').val('');
			        					            $('#reflex-feedback-dialog-entry-area-txt').css('color', '#000');
			        					        }
			        					    });

			        					    $('#reflex-feedback-dialog-entry-area-txt').keypress(function ()
			        					    {
			        					        Reflex.txtAreaHasDefault = false;
			        					    });

			        					    $('#reflex-feedback-dialog-entry-area-txt').focusout(function ()
			        					    {
			        					        if (Reflex.txtAreaHasDefault) {
			        					            $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
			        					            $('#reflex-feedback-dialog-entry-area-txt').css('color', '#ccc');
			        					        }
			        					    });

			        					    var footer = '<div style="margin:5px 10px;"><p style="padding-top:5px; font-size: 10px; color: rgb(136, 136, 136);">Reflex feedback widget<br />&copy; 2010-2011 Avishkar Autar</p></div>';
			        					    $('.ui-dialog-buttonpane', $('#reflex-feedback-dialog').parent()).append(footer);
			        					    $('.ui-dialog-buttonpane .ui-button-text', $('#reflex-feedback-dialog').parent()).css('padding', '0.7em 1em');

			        					}
			        					},
                                        { buttons: { "Send Feedback": function ()
                                        {
                                            $('#reflex-feedback-dialog').dialog('disable');
                                            $('#reflex-feedback-dialog-entry-area-submitsec .reflex-feedback-sending-msg').show();
                                            Reflex.sendFeedback(Reflex.feedbackType, $('#reflex-feedback-dialog-entry-area-txt').val());
                                        }
                                        }
                                        });
}

Reflex.menuReset = function ()
{ }

Reflex.menuIdeaSelect = function ()
{
    Reflex.menuReset();
    if (Reflex.txtAreaHasDefault) {
        Reflex.curDefaultTxt = 'Tell us about your idea...';
        $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
        $('#reflex-feedback-dialog-entry-area-txt').css('color', Reflex.ghostTxtColor);
    }

    Reflex.feedbackType = 'idea';
}

Reflex.menuQuestionSelect = function ()
{
    Reflex.menuReset();
    if (Reflex.txtAreaHasDefault) {
        Reflex.curDefaultTxt = 'What\'s on your mind...';
        $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
        $('#reflex-feedback-dialog-entry-area-txt').css('color', Reflex.ghostTxtColor);
    }

    Reflex.feedbackType = 'question';
}

Reflex.menuProblemSelect = function ()
{
    Reflex.menuReset();
    if (Reflex.txtAreaHasDefault) {
        Reflex.curDefaultTxt = 'Tell us about your problem...';
        $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
        $('#reflex-feedback-dialog-entry-area-txt').css('color', Reflex.ghostTxtColor);
    }

    Reflex.feedbackType = 'problem';
}

Reflex.menuLikeSelect = function ()
{
    Reflex.menuReset();
    if (Reflex.txtAreaHasDefault) {
        Reflex.curDefaultTxt = 'What do you like...';
        $('#reflex-feedback-dialog-entry-area-txt').val(Reflex.curDefaultTxt);
        $('#reflex-feedback-dialog-entry-area-txt').css('color', Reflex.ghostTxtColor);
    }

    Reflex.feedbackType = 'like';
}

// sendFeedbackFunc([string] feedbackType, [string] feedbackText, [function] onSendSuccess, [function] onSendError);
Reflex.init = function (body, feedbackPostUrl, widgetPos)
{
    Reflex.feedbackPostUrl = feedbackPostUrl;

    if (widgetPos == 'right') {
        Reflex.widgetPos = 'right';
    }

    var css = '<style type="text/css"> .reflex-feedback-dialog-menu-icon { display:inline-block; margin-top:-3px; width:16px; height:16px; background-image:url(reflex.content/icons.png); background-repeat:no-repeat; vertical-align:middle; } #reflex-feedback-dialog-menu { margin:30px auto; text-align:center; } #reflex-feedback-dialog-menu .reflex-feedback-icondiv { opacity:1.0;filter:alpha(opacity=100); width:16px; height:16px; background:url(reflex.content/icons.png) 0 0 no-repeat; position:absolute; top:-5px; left:-5px; } #reflex-feedback-dialog-menu a { display:block; width:100%; height:100%; font-family:trebuchet MS; font-size:16px; text-indent:15px; color:#888; padding-top:3px; } #reflex-feedback-dialog-entry-area { width:85%; margin:20px auto; } #reflex-feedback-dialog-entry-area-txt { border:1px solid #ccc; border-radius:3px; box-shadow:1px 1px 1px #ccc; width:100%; padding:7px; color:#ccc; font-family:Tahoma; font-size:12px; } #reflex-feedback-dialog-entry-area-submitsec .reflex-feedback-sending-msg { text-align:center; display:none; } .reflex-feedback-preloader { margin-right:5px; vertical-align:middle; }</style>';
    $(body).append(css);

    var dialog = '<div style="display:none; font-size:12px;" id="reflex-feedback-dialog"><div id="reflex-feedback-dialog-menu"><input type="radio" id="reflex-feedback-dialog-menu-idea" name="reflex-feedback-dialog-menu-radio" checked="checked" /><label id="reflex-feedback-dialog-menu-idea-lbl" for="reflex-feedback-dialog-menu-idea">Idea</label><input type="radio" id="reflex-feedback-dialog-menu-question" name="reflex-feedback-dialog-menu-radio" /><label id="reflex-feedback-dialog-menu-question-lbl" for="reflex-feedback-dialog-menu-question">Question</label><input type="radio" id="reflex-feedback-dialog-menu-problem" name="reflex-feedback-dialog-menu-radio" /><label id="reflex-feedback-dialog-menu-problem-lbl" for="reflex-feedback-dialog-menu-problem">Problem</label><input type="radio" id="reflex-feedback-dialog-menu-like" name="reflex-feedback-dialog-menu-radio" /><label id="reflex-feedback-dialog-menu-like-lbl" for="reflex-feedback-dialog-menu-like">Like</label></div><div id="reflex-feedback-dialog-entry-area"><textarea id="reflex-feedback-dialog-entry-area-txt" name="reflex-feedback-dialog-entry-area-txt" rows="12"></textarea><div id="reflex-feedback-dialog-entry-area-submitsec"><p class="reflex-feedback-sending-msg"><img class="reflex-feedback-preloader" src="reflex.content/preloader.gif" alt="preloader" />&nbsp;Sending...</p></div><p id="reflex-feedback-send-failure-msg" style="display:none; text-align:center; font-weight:bold; margin-top:20px;">Failed to send your message. Please try again.</p></div></div>';
    var successDialog = '<div style="display:none; text-align:center; padding:30px; font-size:17px; font-weight:bold;" id="reflex-feedback-send-success-dialog"><p>Thank you for your feedback!</p></div>'


    var widgetMarkupStyle = '';
    if (Reflex.widgetPos == 'left') {
        widgetMarkupStyle = "position:fixed; top:37%; left:0; background-color:#f00; width:30px; height:100px;";
    }
    else {
        widgetMarkupStyle = "position:fixed; top:37%; right:0; background-color:#f00; width:30px; height:100px;";
    }

    var widgetMarkup = '<div style="' + widgetMarkupStyle + '" id="reflex-feedback-widget"><a onclick="Reflex.showDialog(); return false;" style="display:block; width:100%; height:100%; background:url(reflex.content/feedback.png) 0 0 no-repeat; text-indent:-999999px;" href="#">FEEDBACK</a>' + dialog + successDialog + '</div>';

    $(body).append(widgetMarkup);
    $("#reflex-feedback-dialog-entry-area button").button();
    $('#reflex-feedback-dialog-menu').buttonset();
    $('#reflex-feedback-dialog-menu .ui-button-text').prepend("<div class='reflex-feedback-dialog-menu-icon'></div>&nbsp;");
    $('#reflex-feedback-dialog-menu-idea-lbl .reflex-feedback-dialog-menu-icon').css('background-position', '-32px center');
    $('#reflex-feedback-dialog-menu-question-lbl .reflex-feedback-dialog-menu-icon').css('background-position', '-48px center');
    $('#reflex-feedback-dialog-menu-problem-lbl .reflex-feedback-dialog-menu-icon').css('background-position', '0px center');
    $('#reflex-feedback-dialog-menu-like-lbl .reflex-feedback-dialog-menu-icon').css('background-position', '-16px center');
    $('#reflex-feedback-dialog-menu .ui-button-text').css('padding', '0.7em 1em');

    $("#reflex-feedback-dialog-menu-idea").click(function ()
    {
        if ($(this).is(':checked')) { Reflex.menuIdeaSelect(); }
    });

    $("#reflex-feedback-dialog-menu-question").click(function ()
    {
        if ($(this).is(':checked')) { Reflex.menuQuestionSelect(); }
    });

    $("#reflex-feedback-dialog-menu-problem").click(function ()
    {
        if ($(this).is(':checked')) { Reflex.menuProblemSelect(); }
    });

    $("#reflex-feedback-dialog-menu-like").click(function ()
    {
        if ($(this).is(':checked')) { Reflex.menuLikeSelect(); }
    });


    Reflex.menuIdeaSelect();
}

Reflex.unInit = function ()
{
    $('#reflex-feedback-dialog').dialog('close');
}