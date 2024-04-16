export interface IError {
  response: {
    data: {
      erros: string[],
      title: string
      status: number
    }
  }
}