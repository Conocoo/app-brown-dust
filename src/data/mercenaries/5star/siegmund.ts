import type { MercenaryTemplate } from '../../../types/mercenary'

export const siegmund: MercenaryTemplate = {
  id: 'siegmund',
  name: '지그문트',
  type: 'attacker',
  star: 5,
  maxHp: 7224,
  atk: 1490,
  def: 10,
  emoji: '⚔️',
  imageId: '1335',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [],
  },
}
