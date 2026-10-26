// BXYZ:..:eliot@bosmanxyz.xyz:..:.www.bosmanxyz.xyz
import { startaSkarm } from './karna/skarm.js';
import { registrera, startaRegister } from './karna/register.js';
import { startaAtgarder } from './karna/atgarder.js';
import overgang from './komponenter/overgang.js';

registrera([overgang]);

startaSkarm();
startaRegister();
startaAtgarder();
