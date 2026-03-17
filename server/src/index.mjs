import express from 'express'
import cors from 'cors'

import eventsRouter   from './routes/events.mjs'
import statusRouter   from './routes/status.mjs'
import historyRouter  from './routes/history.mjs'
import queueRouter    from './routes/queue.mjs'
import controlsRouter from './routes/controls.mjs'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/events',   eventsRouter)
app.use('/status',   statusRouter)
app.use('/history',  historyRouter)
app.use('/queue',    queueRouter)
app.use('/controls', controlsRouter)

const PORT = process.env.PORT ?? 4000
app.listen(PORT, () => console.log(`🎵  music-server on :${PORT}`))
