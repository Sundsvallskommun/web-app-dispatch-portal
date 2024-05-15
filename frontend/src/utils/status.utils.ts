export const getReadableStatus = (status: string) => {
  switch (status) {
    case 'SNAIL_MAIL':
      return 'Papperspost';
    case 'DIGITAL_MAIL':
      return 'Digital post';
    case 'FAILED':
      return 'Misslyckades';
    default:
      return 'Okänt';
  }
};

export const getStatusColor = (status: string) => {
  switch (status) {
    case 'SNAIL_MAIL':
      return 'vattjom';
    case 'DIGITAL_MAIL':
      return 'gronsta';
    case 'FAILED':
      return 'error';
    default:
      return 'warning';
  }
};
