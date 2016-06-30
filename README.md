# BVGE - Bird-view Game Engine
An engine for creating bird-view-based games.

`v1.0`

# How to install
1. Download repository to your main folder.
2. Configure and modify `index.html` and `core/main/Config.js`, optionally `Listeners.js`.
3. Modify (or create) map, for default it's `maps/map1.js` file.

# How to initialize a game in `index.html` file
```html
<!-- Game elements, don't change! -->
<div id="bvge">
	<div id="controls"></div>
	<div id="map">
		<div id="player">
			<div id="coords">x: 0, y: 0</div>
		</div>
		<div id="entities"></div>
		<div id="blocks"></div>
	</div>
</div>

<!-- Libraries -->
<script src="core/libs/XXHR.min.js"></script>
<script src="core/libs/Importer.js"></script>
<script>
var t1 = new Date().getTime();
</script>
<!-- Core files -->
<script src="core/main/BVGE.js"></script>
<script src="core/main/Misc.js"></script>
<script src="core/main/Logger.js"></script>
<script src="core/main/classes/Events.js"></script>
<script src="core/main/classes/Controls.js"></script>
<script src="core/main/classes/Block.js"></script>
<script src="core/main/classes/Map.js"></script>
<script src="core/main/classes/Player.js"></script>
<script src="core/main/classes/World.js"></script>
<script src="core/main/Config.js"></script>
<!-- Custom maps -->
<script src="maps/map1.js"></script>
<!-- BVGE initialization -->
<script>
BVGE.init()
	.setConfig(Config);                // set configuration
BVGE().getConfig()
	.initClasses();                    // initialize all classes
BVGE.loadMap('map1');                  // load map
BVGE().getClass('Map').render(-2, -2); // render it
BVGE.loadEvents();                     // initialize events
</script>
<!-- Listeners -->
<script src="Listeners.js"></script>

<!-- Script after load -->
<script>
BVGE().getClass('Events').event('bvgeload');
BVGE().getClass('Logger')
	.info('Resources loaded, '
		+ (new Date().getTime()-t1)
		+ 'ms.');
</script>
```

Full configuration coming soon.
