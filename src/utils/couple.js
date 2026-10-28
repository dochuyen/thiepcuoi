/** Thứ tự tên trên thiệp: thiệp nhà gái ghi cô dâu trước, thiệp nhà trai ghi chú rể trước */
export const coupleOrder = (config) =>
  config.side === 'bride'
    ? [
        { person: config.bride, familyLabel: 'Nhà Gái' },
        { person: config.groom, familyLabel: 'Nhà Trai' },
      ]
    : [
        { person: config.groom, familyLabel: 'Nhà Trai' },
        { person: config.bride, familyLabel: 'Nhà Gái' },
      ];
