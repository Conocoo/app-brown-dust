import type { MercenaryTemplate } from '../../../types/mercenary'

export const ren: MercenaryTemplate = {
  id: 'ren',
  name: '르네',
  type: 'defender',
  star: 4,
  maxHp: 11512,
  atk: 992,
  def: 15,
  emoji: '🛡️',
  imageId: '1385',
  critRate: 10,
  critDamage: 50,
  agility: 20,
  skill: {
    timing: 'passive',
    target: 'enemy_front',
    attackRange: 'single',
    effects: [],
  },
}
