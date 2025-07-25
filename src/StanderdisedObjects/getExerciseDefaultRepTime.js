import Fuse from 'fuse.js';

export default function getExerciseDefaultRepTime(input) {
    const fuse = new Fuse(
        Object.keys(exercise_rep_list).map(name => ({ name, displayName: name.replace(/-/g, ' ') })),
        {
            keys: ['displayName'],
            threshold: 0.5, // Lower = stricter match (0 = exact match, 1 = match anything)
        }
    );

    const result = fuse.search(input);
    console.log(result.length ? result[0].item.name : 'underfined');
    return result.length ? exercise_rep_list[result[0].item.name] : 1000;
}


const exercise_rep_list = {
    'push-up': 4500,
    'pull-up': 6000,
    'bench-press': 5500,
    'squat': 5000,
    'deadlift': 6500,
    'overhead-press': 5000,
    'bicep-curl': 4000,
    'tricep-dip': 4500,
    'plank-up': 6000,
    'burpee': 7000,
    'lunge': 5000,
    'glute-bridge': 4500,
    'mountain-climber': 3500,
    'crunch': 3000,
    'leg-raise': 4000,
    'sit-up': 4500,
    'jumping-jack': 3000,
    'high-knee': 3500,
    'butt-kick': 3000,
    'Russian-twist': 4000,
    'bicycle-crunch': 4000,
    'calf-raise': 3500,
    'hammer-curl': 4000,
    'incline-press': 5500,
    'decline-press': 5500,
    'lat-pulldown': 5000,
    'face-pull': 4500,
    'chest-fly': 5000,
    'reverse-fly': 5000,
    'shoulder-tap': 3500,
    'side-plank-dip': 4500,
    'wall-sit': 10000,
    'superman': 5000,
    'bird-dog': 4000,
    'jump-squat': 5000,
    'box-jump': 5500,
    'step-up': 5000,
    'kettlebell-swing': 5000,
    'dumbbell-snatch': 6000,
    'dumbbell-clean': 6000,
    'sledgehammer-hit': 6000,
    'medicine-ball-slam': 5500,
    'turkish-get-up': 10000,
    'farmer-carry': 10000,
    'suitcase-carry': 10000,
    'bear-crawl': 7000,
    'crab-walk': 7000,
    'jump-rope': 4000,
    'row-machine': 6000,
    'air-bike': 5500,
    'treadmill-sprint': 8000,
    'treadmill-walk': 10000,
    'elliptical': 10000,
    'stationary-bike': 10000,
    'battle-rope-wave': 6000,
    'skater-jump': 5000,
    'jump-lunge': 6000,
    'toe-touch': 4000,
    'side-lunge': 5000,
    'clamshell': 4500,
    'fire-hydrant': 4500,
    'donkey-kick': 4500,
    'side-leg-raise': 4500,
    'inner-thigh-lift': 4500,
    'scissor-kick': 4000,
    'v-up': 5000,
    'hollow-hold-rock': 5500,
    'arch-rock': 5500,
    'reverse-crunch': 4000,
    'flutter-kick': 4000,
    'wall-push-up': 3500,
    'kneeling-push-up': 4000,
    'diamond-push-up': 5000,
    'archer-push-up': 5500,
    'typewriter-push-up': 6000,
    'pike-push-up': 5000,
    'handstand-hold': 10000,
    'handstand-push-up': 8000,
    'ring-dip': 7000,
    'ring-row': 6000,
    'box-dip': 4500,
    'tricep-kickback': 4000,
    'front-raise': 4000,
    'lateral-raise': 4000,
    'shrug': 3500,
    'upright-row': 4500,
    'cable-fly': 5000,
    'cable-row': 5000,
    'cable-curl': 4000,
    'leg-extension': 5000,
    'leg-curl': 5000,
    'hip-thrust': 5000,
    'sumo-squat': 5000,
    'goblet-squat': 5000,
    'z-press': 5500,
    'landmine-press': 5000,
    't-bar-row': 5500,
    'sled-push': 8000,
    'sled-drag': 8000,
    'resistance-band-row': 4500,
    'resistance-band-squat': 4500,
    'shadow-boxing': 4000,
    'jump-twist': 4000,
    'bouldering': 1000*60,
    'rock-climbing': 1000*60,
}