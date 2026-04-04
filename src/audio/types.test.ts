import { describe, it, expect } from 'vitest'
import { REVEAL_LEVEL_CONFIGS } from './types'

describe('REVEAL_LEVEL_CONFIGS', () => {
  it('has exactly 5 entries', () => {
    expect(REVEAL_LEVEL_CONFIGS).toHaveLength(5)
  })

  it('index 0 is the most warped level (level 4)', () => {
    expect(REVEAL_LEVEL_CONFIGS[0].level).toBe(4)
  })

  it('index 4 is the clean level (level 0)', () => {
    expect(REVEAL_LEVEL_CONFIGS[4].level).toBe(0)
  })

  it('clean level has no effects', () => {
    const clean = REVEAL_LEVEL_CONFIGS[4]
    expect(clean.pitch).toBe(0)
    expect(clean.speed).toBe(1.0)
    expect(clean.reverb).toBe(false)
    expect(clean.distortion).toBe(false)
    expect(clean.filter).toBeNull()
    expect(clean.reversed).toBe(false)
  })

  it('most warped level has all effects active', () => {
    const warped = REVEAL_LEVEL_CONFIGS[0]
    expect(warped.pitch).toBeGreaterThan(0)
    expect(warped.speed).toBeLessThan(1.0)
    expect(warped.reverb).toBe(true)
    expect(warped.distortion).toBe(true)
    expect(warped.reversed).toBe(true)
  })

  it('all levels have required fields', () => {
    for (const config of REVEAL_LEVEL_CONFIGS) {
      expect(typeof config.pitch).toBe('number')
      expect(typeof config.speed).toBe('number')
      expect(typeof config.reverb).toBe('boolean')
      expect(typeof config.distortion).toBe('boolean')
      expect(typeof config.reversed).toBe('boolean')
    }
  })
})
