class NormaMachine:
    def __init__(self):
        pass

    # Operações básicas
    def is_zero(self, x):
        return x == 0

    def inc(self, x):
        return x + 1

    def dec(self, x):
        if self.is_zero(x):
            return x
        return x - 1

    # -----------------------------
    # OPERAÇÕES EM REGISTRADORES
    # -----------------------------

    # A = A + B (não preserva B)
    def soma_sem_preservar(self, A, B):
        while not self.is_zero(B):
            A = self.inc(A)
            B = self.dec(B)
        return A, B

    # A = A + B (preservando B)
    def soma_preservando(self, A, B):
        aux = 0
        while not self.is_zero(B):
            A = self.inc(A)
            aux = self.inc(aux)
            B = self.dec(B)

        while not self.is_zero(aux):
            B = self.inc(B)
            aux = self.dec(aux)

        return A, B

    # A = A * B → retorna em A, preservando B
    def multiplicar(self, A, B):
        temp = 0

        # Copia A para temp
        while not self.is_zero(A):
            temp = self.inc(temp)
            A = self.dec(A)

        # Soma B temp vezes
        while not self.is_zero(temp):
            A, B = self.soma_preservando(A, B)
            temp = self.dec(temp)

        return A, B

    # -----------------------------
    # OPERAÇÕES LÓGICAS
    # -----------------------------

    # Teste A < B
    def menor_que(self, A, B):
        if self.is_zero(A) and not self.is_zero(B):
            return True

        while not self.is_zero(A):
            A = self.dec(A)
            B = self.dec(B)
            if self.is_zero(A) and not self.is_zero(B):
                return True

        return False

    # Teste A ≤ B
    def menor_ou_igual(self, A, B):
        while not self.is_zero(A) and not self.is_zero(B):
            A = self.dec(A)
            B = self.dec(B)
        return self.is_zero(A)

    # CÓPIA
    def copiar(self, A):
        temp = 0
        copia = 0

        while not self.is_zero(A):
            A = self.dec(A)
            temp = self.inc(temp)
            copia = self.inc(copia)

        while not self.is_zero(temp):
            A = self.inc(A)
            temp = self.dec(temp)

        return copia

    # Testa se A é divisível por B
    def divisivel(self, A, B):
        if self.is_zero(B):
            return False

        resto = self.copiar(A)
        copiaB = self.copiar(B)

        while not self.menor_que(resto, copiaB):
            recupera = 0
            while not self.is_zero(copiaB):
                resto = self.dec(resto)
                copiaB = self.dec(copiaB)
                recupera = self.inc(recupera)

            while not self.is_zero(recupera):
                copiaB = self.inc(copiaB)
                recupera = self.dec(recupera)

        return self.is_zero(resto)

    # Teste de primalidade
    def primo(self, A):
        if A <= 1:
            return False

        divisor = 2

        while self.menor_que(divisor, A):
            if self.divisivel(A, divisor):
                return False
            divisor = self.inc(divisor)

        return True


# ------------------------------------
#          MENU PRINCIPAL
# ------------------------------------

def main():
    m = NormaMachine()

    print("=== Máquina de Norma ===")
    print("1 - Soma sem preservar")
    print("2 - Soma preservando")
    print("3 - Multiplicação")
    print("4 - Testar se é primo")
    print("5 - Testar A < B")
    print("6 - Testar A ≤ B")

    opcao = int(input("Escolha: "))

    if opcao in [1, 2, 3, 5, 6]:
        A = int(input("A: "))
        B = int(input("B: "))

    if opcao == 1:
        r, b = m.soma_sem_preservar(A, B)
        print("Resultado:", r)
        print("Valor final de B:", b)

    elif opcao == 2:
        r, b = m.soma_preservando(A, B)
        print("Resultado:", r)
        print("Valor final de B:", b)

    elif opcao == 3:
        r, b = m.multiplicar(A, B)
        print("Produto:", r)
        print("Valor final de B:", b)

    elif opcao == 4:
        A = int(input("Número: "))
        print("Primo" if m.primo(A) else "Não primo")

    elif opcao == 5:
        print("A < B ?" , m.menor_que(A, B))

    elif opcao == 6:
        print("A ≤ B ?" , m.menor_ou_igual(A, B))

    else:
        print("Opção inválida.")


main()
