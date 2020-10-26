//
// API
// https://rawg.io/
//

class VideoGames {
  constructor(number, steps) {
    this.paginationSelector = document.getElementById("paginationSelector");
    this.gridid = document.getElementById("grid");
    this.gridparent = document.getElementById("gridParent");
    this.detailid = document.getElementById("detail");
    this.vignetteBonus = document.getElementById("vignetteBonus");
    this.gameTitle = document.getElementById("gameTitle");
    this.screenshots = document.getElementById("screenshots");
    this.gamePlatforms = document.getElementById("gamePlatforms");
    this.infos = document.getElementById("infos");
    this.vignetteImage = document.getElementById("vignetteBonusImage");
    this.closeButton = document.getElementById("closeDetails");
    this.nextButton = document.getElementById("next");
    this.precButton = document.getElementById("prec");
    this.url = "https://api.rawg.io/api/games?page_size=" + number;
    this.gameList = [];
    this.displayedGameList = [];
    this.indexes = {s: 0, e: 3, p: 1};
    this.steps = steps;
    this.maxPage = number / steps;
    setTimeout(() => {this.paginationSelector.classList.remove("hidden")}, 800);
    this.loadGames();
    this.setPaginationEvent();
    this.setPaginationSelector();
    this.updatePagination();
  }

  setPaginationSelector() {
    var ul=document.createElement('ul');
    for(var i = 0; i < this.maxPage; i++) {
      var li=document.createElement('li');
      li.classList.add("paginationElement");
      ul.appendChild(li);
    }
    this.paginationSelector.appendChild(ul);
  }

  updatePagination() {
    var index = 1;
    for (let item of document.getElementsByClassName("paginationElement")) {
      if(index == this.indexes.p) {
        item.classList.add("active");
      }else{
        item.classList.remove("active");
      }
      index++;
    }
  }

  setPaginationEvent() {
    var execTime = 200;
    this.nextButton.addEventListener("click", () => { this.nextPage(execTime) });
    this.precButton.addEventListener("click", () => { this.precPage(execTime) });
  }

  nextPage(execTime) {
    var vignettes = document.getElementsByClassName("game");
    var index = vignettes.length;
    for (let item of vignettes) {
      index -- ;
      setTimeout(() => {
        item.classList.add("move-right");
      }, index * execTime)
    }
    setTimeout(() => {
      for (let item of vignettes) {
        item.classList.add("move-right-left");
        item.classList.remove("move-right");
      }
      this.updateIndexes(true)
      index = 0;
      for (let item of vignettes) {
        index ++
        setTimeout(() => {
          item.classList.remove("move-right-left");
        }, index * execTime)
      }
    }, (vignettes.length + 1) * execTime)
  }

  precPage(execTime) {
    var vignettes = document.getElementsByClassName("game");
    var index = 0;
    for (let item of vignettes) {
      index ++ ;
      setTimeout(() => {
        item.classList.add("move-left");
      }, index * execTime)
    }
    setTimeout(() => {
      for (let item of vignettes) {
        item.classList.add("move-left-right");
        item.classList.remove("move-left");
      }
      this.updateIndexes(false)
      index = 0;
      for (let item of vignettes) {
        index ++
        setTimeout(() => {
          item.classList.remove("move-left-right");
        }, index * execTime)
      }
    }, (vignettes.length + 1) * execTime)
  }

  updateIndexes(up) {
    if (up) {
      if (this.indexes.e >= this.gameList.length) {
        this.indexes.s = 0;
        this.indexes.e = this.steps;
        this.indexes.p = 1;
      }else{
        this.indexes.s = this.indexes.e;
        this.indexes.e = this.indexes.e + this.steps;
        this.indexes.p = this.indexes.p + 1;
      }
    }else {
      if (this.indexes.s <= 0) {
        this.indexes.e = this.gameList.length;
        this.indexes.s = this.gameList.length - this.steps;
        this.indexes.p = this.maxPage;
      }else{
        this.indexes.e = this.indexes.s;
        this.indexes.s = this.indexes.s - this.steps;
        this.indexes.p = this.indexes.p - 1;
      }
    }
    this.loadDisplayedGames();
    this.refreshDisplayedGames();
    this.updatePagination();
  }

  refreshDisplayedGames() {
    var index = 0;
    for (let item of document.getElementsByClassName("game")) {
      var game = this.displayedGameList[index];
      var image = item.getElementsByTagName('img')[0];
      image.src = game.image;
      index ++;
    }
  }

  loadGames() {
    fetch(this.url)
      .then(response => response.json())
      .then(data => {
      data.results.forEach(element => this.addGame(element));
      this.loadDisplayedGames();
      this.refreshGameList();
    })
  }

  addGame(game) {
    this.gameList.push({
      name: game.name,
      image: game.background_image,
      screenshots: game.short_screenshots,
      platforms: game.platforms
    });
  }

  loadDisplayedGames() {
    this.displayedGameList = this.gameList.slice(this.indexes.s, this.indexes.e);
  }

  refreshGameList() {
    var index = 0;
    this.displayedGameList.forEach(element => {
      this.addGameToDom(element, index);
      index++;
    });
  }

  addGameToDom(game, index) {
    var element = document.createElement("div");
    element.className = "game";
    var img = document.createElement("img");
    img.src = game.image;
    element.appendChild(img);

    element.setAttribute("data-index", index);

    element.addEventListener("click", () => { this.showDetails(element) });
    this.closeButton.addEventListener("click", () => { this.hideDetails() });

    this.gridid.appendChild(element);
  }

  showDetails(element) {
    var game = this.displayedGameList[element.getAttribute("data-index")];
    this.vignetteImage.src = game.image;
    this.gameTitle.innerHTML = game.name;
    this.gamePlatforms.appendChild(this.displayPlatforms(game.platforms));
    this.screenshots.appendChild(this.displayScreenshots(game.screenshots));
    this.detailid.classList.add("active");
    setTimeout(() => {
      this.closeButton.classList.add("active");
      setTimeout(() => {
        this.showDetailGame(element);
      }, 150)
    }, 150)
  }

  resetDetails() {
    this.vignetteImage.src = "";
    this.gameTitle.innerHTML = "";
    this.gamePlatforms.innerHTML = "";
    this.screenshots.innerHTML = "";
  }

  displayScreenshots(sc) {
    var ul=document.createElement('ul');
    sc.shift()
    sc.forEach(el => {
      var li=document.createElement('li');
      var image = document.createElement("img");
      image.src = el.image;
      li.appendChild(image);
      ul.appendChild(li);
    })
    return ul;
  }

  displayPlatforms(pl) {
    var ul=document.createElement('ul');
    pl.forEach(el => {
      var li=document.createElement('li');
      li.innerHTML=el.platform.name;
      ul.appendChild(li);
    })
    return ul;
  }

  hideDetails() {
    this.infos.classList.remove("active");
    this.vignetteBonus.classList.remove("active");
    this.vignetteImage.classList.remove("active");
    this.closeButton.classList.remove("active");
    setTimeout(() => {
      this.detailid.className = "";
      this.resetDetails();
    }, 300)
  }

  showDetailGame(element) {
    this.vignetteBonus.classList.add("active");
    this.vignetteBonus.style.top = element.offsetTop + this.gridparent.offsetTop + 'px';
    this.vignetteBonus.style.left = element.offsetLeft + 'px';
    this.vignetteBonus.style.width = element.offsetWidth + 'px';
    this.vignetteBonus.style.height = element.offsetHeight + 'px';
    setTimeout(() => {
      this.vignetteBonus.style.top = 20 + 'px';
      this.vignetteBonus.style.left = 20 + 'px';
      this.vignetteBonus.style.width = element.offsetWidth * 1.7 + 'px';
      this.vignetteBonus.style.height = element.offsetHeight * 1.7 + 'px';
      setTimeout(() => {
        this.vignetteImage.classList.add("active");
        this.infos.classList.add("active");
      }, 300)
    }, 600)
  }
}

const init = function() {
  
  var games = new VideoGames(12, 3);

}
window.addEventListener('load', init);