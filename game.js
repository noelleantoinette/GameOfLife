function GameOfLife(width, height) {
    this.width = width;
    this.height = height;
    this.stepInterval = null;
}

GameOfLife.prototype.createAndShowBoard = function() {
    var goltable = document.createElement("tbody");
    var tablehtml = '';
    for (var h = 0; h < this.height; h++) {
        tablehtml += "<tr id='row+" + h + "'>";
        for (var w = 0; w < this.width; w++) {
            tablehtml += "<td data-status='dead' id='" + w + "-" + h + "'></td>";
        }
        tablehtml += "</tr>";
    }
    goltable.innerHTML = tablehtml;
    var board = document.getElementById('board');
    board.appendChild(goltable);
    this.setupBoardEvents();
};

GameOfLife.prototype.forEachsquare = function(func) {
    for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
            myid = x + '-' + y;
            square = document.getElementById(myid);
            if (square) {
                func(square, x, y);
            }
        }
    }
};

GameOfLife.prototype.togglesquare = function(square) {
    if (square.getAttribute('data-status') == 'dead') {
        square.className = "alive";
        square.setAttribute('data-status', 'alive');
    } else {
        square.className = "dead";
        square.setAttribute('data-status', 'dead');
    }
};

GameOfLife.prototype.setupBoardEvents = function() {
    var onBoardClick = function(event) {
        var square = event.toElement;
        this.togglesquare(square);
    };
    var board = document.getElementById('board');
    board.onclick = onBoardClick.bind(this);

    var step_btn = document.getElementById('step_btn');
    step_btn.onclick = this.step.bind(this); // yes

    var reset_btn = document.getElementById('reset_btn');
    reset_btn.onclick = this.resetRandom.bind(this);

    var clear_btn = document.getElementById('clear_btn');
    clear_btn.onclick = this.clearBoard.bind(this);

    var play_btn = document.getElementById('play_btn');
    play_btn.onclick = this.enableAutoPlay.bind(this);
};


GameOfLife.prototype.resetRandom = function() {
    var forEachFunc = function(square) {
        if (Math.random() < .5) {
            this.togglesquare(square);
        }
    };
    this.forEachsquare(forEachFunc.bind(this));
};

GameOfLife.prototype.clearBoard = function() {
    var forEachFunc = function(square) {
        square.setAttribute('data-status', "dead");
        square.className = "dead";
    };

    this.forEachsquare(forEachFunc.bind(this));
    // this.forEachsquare(forEachFunc.bind(this));
    //gol.createAndShowBoard();
};


GameOfLife.prototype.step = function() {
    this.forEachsquare(function(square, x, y) {
        var notdead, nsquare, nid;
        notdead = 0;

        for (var i = -1; i <= 1; i++) {

            for (var j = -1; j <= 1; j++) {

                nid = (x + i) + "-" + (y + j);

                if (nid !== myid) {

                    nsquare = document.getElementById(nid);

                    if (nsquare && nsquare.getAttribute('data-status') === "alive") {

                        notdead++;
                    }
                }
            }
        }
        square.setAttribute('neighbs', notdead);
    });

    var self = this;
    this.forEachsquare(function(square, x, y) {

        var newsquareStatus = self.newBoard(square);

        square.setAttribute('data-status', newsquareStatus);

        square.setAttribute('neighbs', -1);

        square.className = newsquareStatus;

    });
};

GameOfLife.prototype.newBoard = function(square) {
    var status = square.getAttribute('data-status');
    var numNeighbors = square.getAttribute('neighbs') * 1;
    var setAttributeus = status;

    if (status == "alive" && (numNeighbors < 2 || numNeighbors > 3)) {
        setAttributeus = "dead";
    } else if (status == "dead" && numNeighbors === 3) {
        console.log(numNeighbors)
        setAttributeus = "alive";
    }

    return setAttributeus;
};


GameOfLife.prototype.enableAutoPlay = function() {

    if (this.stepInterval) {
        window.clearInterval(this.stepInterval);
        this.stepInterval = false;
        this.step();

    } else {

        var self = this;
        this.stepInterval = window.setInterval(function() {
            self.step();
        }, 200);

        this.step();
    }
};

var gol = new GameOfLife(20, 20);
gol.createAndShowBoard();


