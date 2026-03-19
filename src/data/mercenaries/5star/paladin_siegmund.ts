import type { MercenaryTemplate } from '../../../types/mercenary'

export const paladin_siegmund: MercenaryTemplate = {
  id: 'paladin_siegmund',
  name: '성기사 지그문트',
  type: 'attacker',
  star: 5,
  maxHp: 5902,
  atk: 578,
  def: 10,
  emoji: '⚔️',
  imageId: '9757',
  critRate: 10,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'passive',
    target: 'enemy_back',
    attackRange: 'single',
    effects: [
      { type: 'shield', value: 65, duration: 35, buffType: 'shield', target: 'self' },
      { type: 'regeneration', value: 12, duration: 35, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
