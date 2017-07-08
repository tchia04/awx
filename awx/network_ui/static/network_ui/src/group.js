var inherits = require('inherits');
var fsm = require('./fsm.js');
var models = require('./models.js');

function _State () {
}
inherits(_State, fsm._State);


function _Resize () {
    this.name = 'Resize';
}
inherits(_Resize, _State);
var Resize = new _Resize();
exports.Resize = Resize;

function _Start () {
    this.name = 'Start';
}
inherits(_Start, _State);
var Start = new _Start();
exports.Start = Start;

function _CornerSelected () {
    this.name = 'CornerSelected';
}
inherits(_CornerSelected, _State);
var CornerSelected = new _CornerSelected();
exports.CornerSelected = CornerSelected;

function _Selected1 () {
    this.name = 'Selected1';
}
inherits(_Selected1, _State);
var Selected1 = new _Selected1();
exports.Selected1 = Selected1;

function _Selected3 () {
    this.name = 'Selected3';
}
inherits(_Selected3, _State);
var Selected3 = new _Selected3();
exports.Selected3 = Selected3;

function _Move () {
    this.name = 'Move';
}
inherits(_Move, _State);
var Move = new _Move();
exports.Move = Move;

function _Ready () {
    this.name = 'Ready';
}
inherits(_Ready, _State);
var Ready = new _Ready();
exports.Ready = Ready;

function _EditLabel () {
    this.name = 'EditLabel';
}
inherits(_EditLabel, _State);
var EditLabel = new _EditLabel();
exports.EditLabel = EditLabel;

function _Selected2 () {
    this.name = 'Selected2';
}
inherits(_Selected2, _State);
var Selected2 = new _Selected2();
exports.Selected2 = Selected2;

function _Placing () {
    this.name = 'Placing';
}
inherits(_Placing, _State);
var Placing = new _Placing();
exports.Placing = Placing;


_Resize.prototype.onMouseUp = function (controller, msg_type, $event) {

    controller.changeState(Selected1);
    controller.handle_message(msg_type, $event);

};
_Resize.prototype.onMouseUp.transitions = ['Selected1'];

_Resize.prototype.onMouseMove = function (controller) {

    var groups = controller.scope.selected_groups;

    var diffX = controller.scope.scaledX - controller.scope.pressedScaledX;
    var diffY = controller.scope.scaledY - controller.scope.pressedScaledY;
    var i = 0;
    for (i = 0; i < groups.length; i++) {
        if (groups[i].selected_corner === models.TOP_LEFT) {
            groups[i].x1 = groups[i].x1 + diffX;
            groups[i].y1 = groups[i].y1 + diffY;
        }
        if (groups[i].selected_corner === models.BOTTOM_RIGHT) {
            groups[i].x2 = groups[i].x2 + diffX;
            groups[i].y2 = groups[i].y2 + diffY;
        }
        if (groups[i].selected_corner === models.TOP_RIGHT) {
            groups[i].x2 = groups[i].x2 + diffX;
            groups[i].y1 = groups[i].y1 + diffY;
        }
        if (groups[i].selected_corner === models.BOTTOM_LEFT) {
            groups[i].x1 = groups[i].x1 + diffX;
            groups[i].y2 = groups[i].y2 + diffY;
        }
    }
    controller.scope.pressedScaledX = controller.scope.scaledX;
    controller.scope.pressedScaledY = controller.scope.scaledY;
};


_Start.prototype.start = function (controller) {

    controller.changeState(Ready);

};
_Start.prototype.start.transitions = ['Ready'];

_CornerSelected.prototype.start = function (controller) {

    var groups = controller.scope.selected_groups;
    var i = 0;
    var x = controller.scope.scaledX;
    var y = controller.scope.scaledY;
    for (i = 0; i < groups.length; i++) {
        groups[i].selected_corner = groups[i].select_corner(x, y);
    }
};

_CornerSelected.prototype.onMouseMove = function (controller) {

    controller.changeState(Resize);
};
_CornerSelected.prototype.onMouseMove.transitions = ['Resize'];

_CornerSelected.prototype.onMouseUp = function (controller, msg_type, $event) {

    controller.changeState(Selected1);
    controller.handle_message(msg_type, $event);
};
_CornerSelected.prototype.onMouseUp.transitions = ['Selected1'];



_Selected1.prototype.onMouseMove = function (controller) {

    controller.changeState(Move);

};
_Selected1.prototype.onMouseMove.transitions = ['Move'];

_Selected1.prototype.onMouseUp = function (controller) {

    controller.changeState(Selected2);
};
_Selected1.prototype.onMouseUp.transitions = ['Selected2'];



_Selected3.prototype.onMouseMove = function (controller) {

    controller.changeState(Move);

};
_Selected3.prototype.onMouseMove.transitions = ['Move'];

_Selected3.prototype.onMouseUp = function (controller) {

    controller.changeState(EditLabel);

};
_Selected3.prototype.onMouseUp.transitions = ['EditLabel'];


_Move.prototype.onMouseMove = function (controller) {

    var groups = controller.scope.selected_groups;

    var diffX = controller.scope.scaledX - controller.scope.pressedScaledX;
    var diffY = controller.scope.scaledY - controller.scope.pressedScaledY;
    var i = 0;
    for (i = 0; i < groups.length; i++) {
        groups[i].x1 = groups[i].x1 + diffX;
        groups[i].y1 = groups[i].y1 + diffY;
        groups[i].x2 = groups[i].x2 + diffX;
        groups[i].y2 = groups[i].y2 + diffY;
    }
    controller.scope.pressedScaledX = controller.scope.scaledX;
    controller.scope.pressedScaledY = controller.scope.scaledY;
};

_Move.prototype.onMouseUp = function (controller) {

    controller.changeState(Selected2);

};
_Move.prototype.onMouseUp.transitions = ['Selected2'];

_Move.prototype.onMouseDown = function (controller) {

    controller.changeState(Selected1);
};
_Move.prototype.onMouseDown.transitions = ['Selected1'];

_Ready.prototype.onMouseMove = function (controller, msg_type, $event) {

    var i = 0;

    for (i = 0; i < controller.scope.groups.length; i++) {
        controller.scope.groups[i].update_hightlighted(controller.scope.scaledX, controller.scope.scaledY);
    }

    controller.next_controller.handle_message(msg_type, $event);
};


_Ready.prototype.onMouseDown = function (controller, msg_type, $event) {



    //
    var i = 0;
    for (i = 0; i < controller.scope.groups.length; i++) {
        if (controller.scope.groups[i].has_corner_selected(controller.scope.scaledX, controller.scope.scaledY)) {
            if (controller.scope.selected_groups.indexOf(controller.scope.groups[i]) === -1) {
                controller.scope.selected_groups.push(controller.scope.groups[i]);
            }
            controller.scope.groups[i].selected = true;
            controller.changeState(CornerSelected);
            controller.scope.pressedX = controller.scope.mouseX;
            controller.scope.pressedY = controller.scope.mouseY;
            controller.scope.pressedScaledX = controller.scope.scaledX;
            controller.scope.pressedScaledY = controller.scope.scaledY;

            return;
        } else if (controller.scope.groups[i].is_selected(controller.scope.scaledX, controller.scope.scaledY)) {
            if (controller.scope.selected_groups.indexOf(controller.scope.groups[i]) === -1) {
                controller.scope.selected_groups.push(controller.scope.groups[i]);
            }
            controller.scope.groups[i].selected = true;
            controller.changeState(Selected1);
            controller.scope.pressedX = controller.scope.mouseX;
            controller.scope.pressedY = controller.scope.mouseY;
            controller.scope.pressedScaledX = controller.scope.scaledX;
            controller.scope.pressedScaledY = controller.scope.scaledY;

            return;
        }
    }

    controller.scope.selected_groups = [];
    controller.next_controller.handle_message(msg_type, $event);

};
_Ready.prototype.onMouseDown.transitions = ['Selected1', 'CornerSelected'];


_Ready.prototype.onNewGroup = function (controller) {
    controller.changeState(Placing);
};
_Ready.prototype.onNewGroup.transitions = ['Placing'];





_EditLabel.prototype.onMouseDown = function (controller) {

    controller.changeState(Ready);

};
_EditLabel.prototype.onMouseDown.transitions = ['Ready'];


_Selected2.prototype.onNewGroup = function (controller, msg_type, $event) {

    controller.changeState(Ready);
    controller.handle_message(msg_type, $event);

};
_Selected2.prototype.onNewGroup.transitions = ['Ready'];


_Selected2.prototype.onMouseDown = function (controller, msg_type, $event) {

    controller.changeState(Ready);
    controller.handle_message(msg_type, $event);

    //controller.changeState(Selected3);

};
_Selected2.prototype.onMouseDown.transitions = ['Ready', 'Selected3'];




_Placing.prototype.onMouseDown = function (controller) {

	var scope = controller.scope;
    var group = null;

    scope.pressedX = scope.mouseX;
    scope.pressedY = scope.mouseY;
    scope.pressedScaledX = scope.scaledX;
    scope.pressedScaledY = scope.scaledY;

    scope.clear_selections();

    group = new models.Group(scope.group_id_seq(),
                             "Group",
                             scope.scaledX,
                             scope.scaledY,
                             scope.scaledX,
                             scope.scaledY,
                             false);

    scope.groups.push(group);
    scope.selected_groups.push(group);
    group.selected = true;
    group.selected_corner = models.BOTTOM_RIGHT;

    controller.changeState(Resize);
};
_Placing.prototype.onMouseDown.transitions = ['CornerSelected'];

