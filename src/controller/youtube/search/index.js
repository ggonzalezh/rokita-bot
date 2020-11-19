import ytsr from 'ytsr'

const searchSong = (songName) => {
    try {
        return await ytsr(songName)
    } catch (error) {
        
    }
}