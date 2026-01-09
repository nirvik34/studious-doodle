import express from 'express'
import cors from 'cors'

const app = express()

// Python model API URL
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000'

app.use(express.json({ limit: '10mb' }))
app.use(
    cors({
        origin: [/^http:\/\/localhost:\d+$/],
    })
)

app.get('/api/health', async (_req, res) => {
    try {
        // Check if Python model is running
        const response = await fetch(`${PYTHON_API_URL}/health`)
        const modelHealth = await response.json()
        res.json({ ok: true, modelConnected: modelHealth.ok })
    } catch (error) {
        res.json({ ok: true, modelConnected: false })
    }
})

app.post('/api/scan', async (req, res) => {
    try {
        const { image, profile, fast } = req.body || {}
        
        if (!image) {
            return res.status(400).json({ error: 'No image provided' })
        }

        // Call Python model API
        const response = await fetch(`${PYTHON_API_URL}/predict`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image })
        })

        if (!response.ok) {
            const error = await response.json()
            return res.status(response.status).json(error)
        }

        const result = await response.json()
        
        // Calculate risk based on asymmetry score
        const asymmetryScore = result.score
        let risk = 'low'
        let riskLevel = 0
        
        if (asymmetryScore > 0.7) {
            risk = 'high'
            riskLevel = 3
        } else if (asymmetryScore > 0.4) {
            risk = 'medium'
            riskLevel = 2
        } else {
            risk = 'low'
            riskLevel = 1
        }

        res.json({
            asymmetryScore,
            risk,
            riskLevel,
            detected: result.detected,
            ts: new Date().toISOString(),
        })
        
    } catch (error) {
        console.error('Error calling Python model:', error)
        res.status(500).json({ error: 'Failed to process image' })
    }
})

const port = Number(process.env.PORT || 8081)
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Stroke server listening on http://localhost:${port}`)
    console.log(`Python model API: ${PYTHON_API_URL}`)
})
