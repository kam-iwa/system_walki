//=============================================================================
// SystemWalki.js
//=============================================================================

/*:
 * @plugindesc Skrypty niezbędne do działania dla mojego systemu walki.
 * @author Keibi
 *
 * @param Zmienna HP przeciwników
 * @desc Jak na razie jest to bezużyteczny parametr
 * @default 2
 *
 * @help
 * W tej chwili brak pomocy dla tych skryptów.
 */

function ustawDanePotworow(zmienna){
	$gameVariables.setValue(zmienna, ["hp"]);
	for(var i = 1;i < $gameMap._events.length;i++){
		if($dataMap.events[i] === null){
			$gameVariables.value(zmienna).push(1);
		}
		else {
			if ($dataMap.events[i].meta.enemy){
				$gameVariables.value(zmienna).push($dataEnemies[$dataMap.events[i].meta.enemy].params[0]);
			}
			else{
				$gameVariables.value(zmienna).push(1);
			}
	}
	}
}
 
function sprawdzAtakFizycznyPrzeciwnika(zdarzenie){
	if($gameMap.event(zdarzenie).direction() == 2){
		return (Math.abs($gameMap.event(zdarzenie).y - $gamePlayer.y) + Math.abs($gameMap.event(zdarzenie).x - $gamePlayer.x) == 1) && ($gameMap.event(zdarzenie).y < $gamePlayer.y);
	}
	else if($gameMap.event(zdarzenie).direction() == 4){
		return (Math.abs($gameMap.event(zdarzenie).y - $gamePlayer.y) + Math.abs($gameMap.event(zdarzenie).x - $gamePlayer.x) == 1) && ($gameMap.event(zdarzenie).x > $gamePlayer.x);
	}
	else if($gameMap.event(zdarzenie).direction() == 6){
		return (Math.abs($gameMap.event(zdarzenie).y - $gamePlayer.y) + Math.abs($gameMap.event(zdarzenie).x - $gamePlayer.x) == 1) && ($gameMap.event(zdarzenie).x < $gamePlayer.x);
	}
	else if($gameMap.event(zdarzenie).direction() == 8){
		return (Math.abs($gameMap.event(zdarzenie).y - $gamePlayer.y) + Math.abs($gameMap.event(zdarzenie).x - $gamePlayer.x) == 1) && ($gameMap.event(zdarzenie).y > $gamePlayer.y);
	}
	else{
		return false
	}
}
 
function sprawdzAtakDystansowyPrzeciwnika(zdarzenie, zasieg){
	if($gameMap.event(zdarzenie).direction() == 2){
		return Math.abs($gameMap.event(zdarzenie).y - $gamePlayer.y) <= zasieg && $gameMap.event(zdarzenie).x == $gamePlayer.x && $gameMap.event(zdarzenie).y < $gamePlayer.y;
	}
	else if($gameMap.event(zdarzenie).direction() == 4){
		return Math.abs($gameMap.event(zdarzenie).x - $gamePlayer.x) <= zasieg && $gameMap.event(zdarzenie).y == $gamePlayer.y && $gameMap.event(zdarzenie).x > $gamePlayer.x;
	}
	else if($gameMap.event(zdarzenie).direction() == 6){
		return Math.abs($gameMap.event(zdarzenie).x - $gamePlayer.x) <= zasieg && $gameMap.event(zdarzenie).y == $gamePlayer.y && $gameMap.event(zdarzenie).x < $gamePlayer.x;
	}
	else if($gameMap.event(zdarzenie).direction() == 8){
		return Math.abs($gameMap.event(zdarzenie).y - $gamePlayer.y) <= zasieg && $gameMap.event(zdarzenie).x == $gamePlayer.x && $gameMap.event(zdarzenie).y > $gamePlayer.y;
	}
	else{
		return false
	}
}

function atakFizyczny(){
	if($gamePlayer.direction() == 2){
		var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x, $gamePlayer.y+1);
	}
	else if($gamePlayer.direction() == 4){
		var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x-1, $gamePlayer.y);
	}
	else if($gamePlayer.direction() == 6){
		var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x+1, $gamePlayer.y);
	}
	else if($gamePlayer.direction() == 8){
		var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x, $gamePlayer.y-1);
	}
	else{
		var _eventIdFound = 0;
	}
	if (_eventIdFound != 0){
		if ($gameMap.event(_eventIdFound)._characterName != "" && $dataMap.events[_eventIdFound].meta.enemy){
			$gameVariables.setValue(3, $gameActors.actor(1).atk - $dataEnemies[$dataMap.events[_eventIdFound].meta.enemy].params[3]);
			$gameVariables.value(2)[_eventIdFound] = $gameVariables.value(2)[_eventIdFound] - $gameVariables.value(3);
			if ($gameVariables.value(3) > 0){
				if($gameActors.actor(1).equips()[0] && !$gameActors.actor(1).isWtypeEquipped(2)){
					$gameMap.event(_eventIdFound).requestAnimation($dataWeapons[$gameActors.actor(1).equips()[0].id].meta.anim);
				}
				else{
					$gameMap.event(_eventIdFound).requestAnimation(3);
				}
			}
			else{
				return -1;
			}
			if($gameVariables.value(2)[_eventIdFound] <= 0){
				window.setTimeout('', 500);
				$gameMap.eraseEvent(_eventIdFound);
			}
		}
	}
	return -1;
}

function atakDystansowy(){
	for(var i = 1;i <= $dataWeapons[$gameActors.actor(1)._equips[0].itemId()].meta.range; i++){
		if($gamePlayer.direction() == 2){
			var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x, $gamePlayer.y+i);
			$gameVariables.setValue(5, $gameVariables.value(5));
			$gameVariables.setValue(6, $gameVariables.value(6)+48);
			if ((!$gameMap.isPassable($gamePlayer.x, $gamePlayer.y+i, 4) || !$gameMap.isPassable($gamePlayer.x, $gamePlayer.y+i, 6) || !$gameMap.isPassable($gamePlayer.x, $gamePlayer.y+i, 8)) && $gameMap.terrainTag($gamePlayer.x, $gamePlayer.y+i) != 1){
			break;
			}
		}
		else if($gamePlayer.direction() == 4){
			var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x-i, $gamePlayer.y);
			$gameVariables.setValue(5, $gameVariables.value(5)-48);
			$gameVariables.setValue(6, $gameVariables.value(6));
			if ((!$gameMap.isPassable($gamePlayer.x-i, $gamePlayer.y, 2) || !$gameMap.isPassable($gamePlayer.x-i, $gamePlayer.y, 6) || !$gameMap.isPassable($gamePlayer.x-i, $gamePlayer.y, 8)) && $gameMap.terrainTag($gamePlayer.x-i, $gamePlayer.y) != 1){
			break;
			}
		}
		else if($gamePlayer.direction() == 6){
			var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x+i, $gamePlayer.y);
			$gameVariables.setValue(5, $gameVariables.value(5)+48);
			$gameVariables.setValue(6, $gameVariables.value(6));
			if ((!$gameMap.isPassable($gamePlayer.x+i, $gamePlayer.y, 2) || !$gameMap.isPassable($gamePlayer.x+i, $gamePlayer.y, 4) || !$gameMap.isPassable($gamePlayer.x+i, $gamePlayer.y, 8)) && $gameMap.terrainTag($gamePlayer.x+i, $gamePlayer.y) != 1){
			break;
			}
		}
		else if($gamePlayer.direction() == 8){
			var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x, $gamePlayer.y-i);
			$gameVariables.setValue(5, $gameVariables.value(5));
			$gameVariables.setValue(6, $gameVariables.value(6)-48);
			if ((!$gameMap.isPassable($gamePlayer.x, $gamePlayer.y-i, 2) || !$gameMap.isPassable($gamePlayer.x, $gamePlayer.y-i, 4) || !$gameMap.isPassable($gamePlayer.x, $gamePlayer.y-i, 6)) && $gameMap.terrainTag($gamePlayer.x, $gamePlayer.y-i) != 1){
			break;
			}
		}
		else{
			var _eventIdFound = 0;
		}
		if (_eventIdFound != 0 && $dataMap.events[_eventIdFound].meta.enemy && $gameMap.event(_eventIdFound)._characterName != ""){
			$gameMap.event(_eventIdFound).requestAnimation(Number($dataWeapons[$gameActors.actor(1).equips()[0].id].meta.anim));
			$gameVariables.setValue(3, $gameActors.actor(1).mat);
			$gameVariables.value(2)[_eventIdFound] = $gameVariables.value(2)[_eventIdFound] - $gameVariables.value(3); 
			if($gameVariables.value(2)[_eventIdFound]<= 0){
				a = _eventIdFound;window.setTimeout('$gameMap.eraseEvent(a)', 500);
			}
			else if(_eventIdFound != 0 && ($gameMap.event(_eventIdFound)._characterName != "" || !$dataMap.events[_eventIdFound].meta.npc || !$dataMap.events[_eventIdFound].meta.tech)){
				break;
			}
			
		}
		$gameScreen.movePicture(1, 1, $gameVariables.value(5), $gameVariables.value(6), 100, 100, 255, 0, 10);
	}
	$gameParty.loseItem($dataItems[Number($dataWeapons[$gameActors.actor(1).equips()[0].id].meta.ammo)], 1);
}

function rozjedzPieszego(){
	if($gamePlayer.direction() == 2){
		var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x, $gamePlayer.y+1);
	}
	else if($gamePlayer.direction() == 4){
		var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x-1, $gamePlayer.y);
	}
	else if($gamePlayer.direction() == 6){
		var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x+1, $gamePlayer.y);
	}
	else if($gamePlayer.direction() == 8){
		var _eventIdFound = $gameMap.eventIdXy($gamePlayer.x, $gamePlayer.y-1);
	}
	else{
		var _eventIdFound = 0;
	}
	if (_eventIdFound != 0 && $gameVariables.value(2)[_eventIdFound] > 0 && !$dataMap.events[_eventIdFound].meta.npc && !$dataMap.events[_eventIdFound].meta.tech){
		$gameMap.event(_eventIdFound).requestAnimation(2);
		$gameVariables.value(2)[_eventIdFound] = 0;
		if($gameVariables.value(2)[_eventIdFound]<= 0){
			a = _eventIdFound;window.setTimeout('$gameMap.eraseEvent(a)', 10);
		}
	}
}

function wrogAtakFizyczny(zdarzenie){
	var obrazenia = $dataEnemies[$dataMap.events[zdarzenie].meta.enemy].params[2] - $gameActors.actor(1).def;
	if(obrazenia > 0){
		$gameParty.leader()._hp = $gameParty.leader()._hp - obrazenia;
		$gamePlayer.requestAnimation($dataEnemies[$dataMap.events[zdarzenie].meta.enemy].meta.anim);
	}
	if($gameParty.leader()._hp <= 0){
		SceneManager.goto(Scene_Gameover);
	}
}

function wrogAtakDystansowy(zdarzenie){
	var coords = [-1,-1];
	for(var i = 1; i <= $dataEnemies[$dataMap.events[zdarzenie].meta.enemy].meta.range; i++){
		if($gameMap.event(zdarzenie).direction() == 2){
			$gameVariables.setValue(7, $gameVariables.value(7));
			$gameVariables.setValue(8, $gameVariables.value(8)+48);
			if ((!$gameMap.isPassable($gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y+i, 4) || !$gameMap.isPassable($gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y+i, 6) || !$gameMap.isPassable($gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y+i, 8)) && $gameMap.terrainTag($gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y+i) != 1){
				break;
			}
			coords = [$gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y+i];
		}
		else if($gameMap.event(zdarzenie).direction() == 4){
			$gameVariables.setValue(7, $gameVariables.value(7)-48);
			$gameVariables.setValue(8, $gameVariables.value(8));
			if ((!$gameMap.isPassable($gameMap.event(zdarzenie).x-i, $gameMap.event(zdarzenie).y, 2) || !$gameMap.isPassable($gameMap.event(zdarzenie).x-i, $gameMap.event(zdarzenie).y, 6) || !$gameMap.isPassable($gameMap.event(zdarzenie).x-i, $gameMap.event(zdarzenie).y, 8)) && $gameMap.terrainTag($gameMap.event(zdarzenie).x-i, $gameMap.event(zdarzenie).y) != 1){
				break;
			}
			coords = [$gameMap.event(zdarzenie).x-i, $gameMap.event(zdarzenie).y];
		}
		else if($gameMap.event(zdarzenie).direction() == 6){
			$gameVariables.setValue(7, $gameVariables.value(7)+48);
			$gameVariables.setValue(8, $gameVariables.value(8));
			if ((!$gameMap.isPassable($gameMap.event(zdarzenie).x+i, $gameMap.event(zdarzenie).y, 2) || !$gameMap.isPassable($gameMap.event(zdarzenie).x+i, $gameMap.event(zdarzenie).y, 4) || !$gameMap.isPassable($gameMap.event(zdarzenie).x+i, $gameMap.event(zdarzenie).y, 8)) && $gameMap.terrainTag($gameMap.event(zdarzenie).x+i, $gameMap.event(zdarzenie).y) != 1){
				break;
			}
			coords = [$gameMap.event(zdarzenie).x+i, $gameMap.event(zdarzenie).y];
		}
		else if($gameMap.event(zdarzenie).direction() == 8){
			$gameVariables.setValue(7, $gameVariables.value(7));
			$gameVariables.setValue(8, $gameVariables.value(8)-48);
			if ((!$gameMap.isPassable($gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y-i, 2) || !$gameMap.isPassable($gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y-i, 4) || !$gameMap.isPassable($gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y-i, 6)) && $gameMap.terrainTag($gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y-i) != 1){
				break;
			}
			coords = [$gameMap.event(zdarzenie).x, $gameMap.event(zdarzenie).y-i];
		}
		else{
			break;
		}
		var _eventIdFound = $gameMap.eventIdXy(coords[0], coords[1]);
		if (_eventIdFound != 0 && $gameVariables.value(2)[_eventIdFound] > 0 && !$dataMap.events[_eventIdFound].meta.npc && !$dataMap.events[_eventIdFound].meta.tech){
			$gameMap.event(_eventIdFound).requestAnimation(2);
			$gameVariables.value(2)[_eventIdFound] = 0;
			if($gameVariables.value(2)[_eventIdFound]<= 0){
				a = _eventIdFound;window.setTimeout('$gameMap.eraseEvent(a)', 10);
				break;
			}
			else if(_eventIdFound != 0 && ($gameMap.event(_eventIdFound)._characterName != "" || !$dataMap.events[_eventIdFound].meta.npc || !$dataMap.events[_eventIdFound].meta.tech)){
				break;
			}
		}
		if($gamePlayer.x == coords[0] && $gamePlayer.y == coords[1]){
			$gameParty.leader()._hp = $gameParty.leader()._hp - $dataEnemies[$dataMap.events[zdarzenie].meta.enemy].params[4];
			$gamePlayer.requestAnimation($dataEnemies[$dataMap.events[zdarzenie].meta.enemy].meta.anim);
			break;
		}
		$gameScreen.movePicture(2, 1, $gameVariables.value(7), $gameVariables.value(8), 100, 100, 255, 0, 10);
	}
	if($gameParty.leader()._hp <= 0){
		SceneManager.goto(Scene_Gameover);
	}
}