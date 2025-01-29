const env = require("dotenv").config().parsed
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')
const path = require('path')

// alteratif ketika malas untuk tentukan bin direktori ffmpeg
// const ffmpegStatic = require('ffmpeg-static')

const directoryOutput = `${env.DST_PATH}/${env.VIDEO_NAME}`
const srcInputVideo = `${env.SRC_PATH}/${env.VIDEO_NAME}.${env.VIDEO_PREFIX}`;
const dstOutputVideo = `${env.DST_PATH}/${env.VIDEO_NAME}/${env.MANIFEST_MPD}`;
const scaleOptions = ['scale=1280:720', 'scale=640:320'];
const videoCodec = 'libx264';
const x264Options = 'keyint=24:min-keyint=24:no-scenecut';
const videoBitrates = ['1000k', '2000k', '4000k'];


const createFolder = async (params, callback) => {
    if(fs.existsSync(params)) {
        console.log(`${params} directory is already exists, skip create a folder`)
    }  else {
        fs.mkdir(params, {recursive: true}, (err)=>{
            if(err) {
                console.log('failed to create directory: ' + params)
                return console.error(err)
            } else {
                console.log('succes create directory: ' + params)  
            }
        })
    }

    callback(params)
 

}

const readFolder = async (params) => {
    if(!fs.existsSync(params)) {
        return console.log('message: ' + params)
    } else {
        const directoryPath = path.join(__dirname, params)
        fs.readdir(directoryPath, (err,files) => {
            if(err) {
                return console.log(`unable to scan directory: ${err}`);
            } 
            console.log('already exists: ' + params);
            if(files.length) {
                files.forEach((file) => {
                    console.log(file);
                    
                    const filePath = path.join(params, file);
                    fs.unlink(filePath,(err)=>{
                        if(err) {
                            return console.log(err);
                        }
                        console.log(`re-set file: ${filePath}`);
                    });
                })
            }
            transcoding()
        })
    }
}

createFolder(directoryOutput,readFolder)


async function transcoding() {
    // ffmpeg.setFfmpegPath(ffmpegStatic);
    ffmpeg.setFfmpegPath(env.FFMPEG_BIN);
    ffmpeg(srcInputVideo)
    .videoFilters(scaleOptions)
    .videoCodec(videoCodec)
    .addOption('-x264opts', x264Options)
    .outputOptions('-b:v', videoBitrates[0])
    .format('dash')
    .output(dstOutputVideo)
    .on('start', (commandLine) => {
        console.log('Starting DASH transcoding...');
        console.log('FFmpeg command: ', commandLine);
    })
    .on('progress', (progress) => {
        console.log(`progress : ${progress.frames} frame`)
    })
    .on('error', (err,stdout,stderr) => {
        console.error('Error:', err.message)
        console.error('FFmpeg stdout:', stdout)
        console.error('FFmpeg stderr:', stderr)
    })
    .run();
}


















  
// const inputVideo = 'repo/obs.mp4';
// const folderName = path.basename(inputVideo, path.extname(inputVideo))
// const folderPath = path.join('public', 'videos', folderName);
// const outputDir = 'dash_output';
// const outputManifest = path.join(outputDir, 'manifest.mpd');

// const env = {
//     ffmpegPath: `C:\\ffmpeg\\bin\\ffmpeg`,
// }

// if(!fs.existsSync(folderPath)) {
//     fs.mkdirSync(folderPath, {recursive: true})
//     console.log(`Folder created: ${folderPath}`);
// } else {
//     console.log(`Folder already exist: ${folderPath}`);    
// }



// function getVideoDuration(input) {
//     const duration = execSync(`ffprobe -v error -show_format -show_streams "${input}"`).toString();
//     const match = duration.match(/duration=(\d+\.\d+)/); // Regex to match the duration line
//     return match ? parseFloat(match[1]) : 0;
// }

// const videoDuration = getVideoDuration(inputVideo);
// const chunkDuration = Math.max(Math.floor(videoDuration / 100), 5); // Set chunk time, no less than 5 seconds


// console.log(`Video Duration: ${videoDuration} seconds`);
// console.log(`Chunk Duration: ${chunkDuration} seconds`);    

// Ffmpeg.setFfmpegPath(`${env.ffmpegPath}`)
// Ffmpeg(inputVideo)
//     .outputOptions([
//         // DASH options
//         '-f dash',
//         `-init_seg_name ${path.join(outputDir, 'init_$RepresentationID$.m4s')}`,
//         `-media_seg_name ${path.join(outputDir, 'chunk_$RepresentationID$_$Number%05d$.m4s')}`,
//         '-use_timeline 1',
//         '-use_template 1',
//         '-window_size 5',
//         '-segment_time', chunkDuration,
//         '-force_key_frames', 'expr:gte(t,n_forced*' + chunkDuration + ')',
//         '-reset_timestamps 1',
        
//         // Video options
//         '-map 0:v:0',
//         '-c:v:0 libx264',
//         '-b:v:0 360k',
//         '-s:v:0 640x360',
    
        
//         // Audio options
//         '-map 0:a:0',
//         '-c:a:0 aac',
//         '-b:a:0 128k'
//     ])
//     .output(outputManifest)
//     .on('start', (commandLine) => {
//         console.log('Starting DASH transcoding...');
//         console.log('FFmpeg command: ', commandLine);
//     })
//     .on('progress', (progress) => {
//         console.log(`Progress: ${progress.percent.toFixed(2)}%`)
//     })
//     .on('error', (err,stdout,stderr) => {
//         console.error('Error:', err.message)
//         console.error('FFmpeg stdout:', stdout)
//         console.error('FFmpeg stderr:', stderr)
//     })
//     .on('end', () => {
//         console.log('DASH transcoding completed')
        
//     })
//     .run()


// Ffmpeg.setFfmpegPath(`${env.ffmpegPath}`)
// Ffmpeg(inputVideo)
//   .outputOptions([

//     // DASH options
//     '-f dash',
//     `-init_seg_name init_$RepresentationID$.m4s`,
//     '-media_seg_name chunk_$RepresentationID$_$Number%05d$.m4s',
//     '-use_timeline 1',
//     '-use_template 1',
//     '-window_size 5',
    
//     // Video resolutions
//     // 160x90
//     '-map 0:v:0',
//     '-c:v:0 libvpx-vp9',
//     '-b:v:0 250k',
//     '-s:v:0 160x90',
//     '-keyint_min 150',
//     '-g 150',
//     '-tile-columns 4',
//     '-frame-parallel 1',
    
//     // 320x180
//     '-map 0:v:0',
//     '-c:v:1 libvpx-vp9',
//     '-b:v:1 500k',
//     '-s:v:1 320x180',
//     '-keyint_min 150',
//     '-g 150',
//     '-tile-columns 4',
//     '-frame-parallel 1',
    
//     // 640x360
//     '-map 0:v:0',
//     '-c:v:2 libvpx-vp9',
//     '-b:v:2 750k',
//     '-s:v:2 640x360',
//     '-keyint_min 150',
//     '-g 150',
//     '-tile-columns 4',
//     '-frame-parallel 1',
    
//     // 1280x720
//     '-map 0:v:0',
//     '-c:v:3 libvpx-vp9',
//     '-b:v:3 1500k',
//     '-s:v:3 1280x720',
//     '-keyint_min 150',
//     '-g 150',
//     '-tile-columns 4',
//     '-frame-parallel 1',

//     // Audio options (libvorbis)
//     '-map 0:a:0',
//     '-c:a:0 libvorbis',
//     '-b:a:0 128k'
//   ])
//   .output(outputManifest)  // Output the manifest file
//   .on('start', () => {
//     console.log('Starting DASH transcoding...');
//   })
//   .on('progress', (progress) => {
//     console.log(`Progress: ${progress.percent.toFixed(2)}%`);
//   })
//   .on('error', (err, stdout, stderr) => {
//     console.error('Error:', err.message);
//     console.error('FFmpeg stdout:', stdout);
//     console.error('FFmpeg stderr:', stderr);
//   })
//   .on('end', () => {
//     console.log('DASH transcoding completed');
//   })
//   .run();



