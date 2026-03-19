import type { MercenaryTemplate } from '../../../types/mercenary'

export const leah: MercenaryTemplate = {
  id: 'leah',
  name: '레아',
  type: 'mage',
  star: 4,
  maxHp: 6041,
  atk: 3135,
  def: 5,
  emoji: '🔮',
  imageId: '3435',
  critRate: 50,
  critDamage: 75,
  agility: 15,
  skill: {
    timing: 'passive',
    target: 'enemy_back',
    attackRange: 'x_shape',
    rangeSize: 1,
    effects: [
      { type: 'atk_down', value: 80, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'on_attack_trigger', value: 0, duration: 999, buffType: 'stat_enhance', target: 'self' },
      { type: 'regeneration', value: 10, duration: 4, buffType: 'stat_enhance', target: 'self' },
      { type: 'def_up', value: 35, duration: 4, buffType: 'stat_enhance', target: 'self' },
      { type: 'insert_buff', value: 0, buffType: 'stat_enhance', target: 'self' },
    ],
  },
}
