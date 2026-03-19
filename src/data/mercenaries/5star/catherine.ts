import type { MercenaryTemplate } from '../../../types/mercenary'

export const catherine: MercenaryTemplate = {
  id: 'catherine',
  name: '캐서린',
  type: 'mage',
  star: 5,
  maxHp: 12064,
  atk: 648,
  def: 0,
  emoji: '🔮',
  imageId: '3915',
  critRate: 50,
  critDamage: 50,
  agility: 0,
  skill: {
    timing: 'after_attack',
    target: 'enemy_back',
    attackRange: 'area_n',
    rangeSize: 1,
    effects: [
      { type: 'atk_down', value: 80, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'dot', value: 0.15, duration: 6, debuffClass: 'dot' },
    ],
  },
}
