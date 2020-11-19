import ytpl from 'ytpl'
import logger from '../../../config/logger.js'

const options = {
    limit: 100
}

const getPlaylist = async (url) => {
    try {
        let playlist = await ytpl(url, options)
        return playlist
    } catch (error) {
        logger.error(error)
        return error
    }
}

