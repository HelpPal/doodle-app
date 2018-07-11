
import { quicksand } from '~/fonts';

export default {
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: 10
    },
    title: ({ accentColor }) => ({
        fontFamily: quicksand,
        fontWeight: 'lighter',
        fontSize: 14,
        color: accentColor,
        flex: 1,
        marginTop: 0
    }),
    input: ({ accentColor }) => ({
      borderColor: accentColor,
      borderWidth: 3,
      borderStyle: 'solid',
      borderRadius: 10,
      appearance: 'none',
      outline: 'none',
      margin: '10px 10px 10px 0',
      padding: 10,
      fontSize: 18,
      fontWeight: 'lighter',
      fontFamily: quicksand
    })
  };
