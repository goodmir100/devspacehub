"""Наполняет базу демонстрационными проектами.

Запуск: python seed.py
"""

from app.seed_data import seed_if_empty


def main() -> None:
    added = seed_if_empty()
    if added:
        print(f"Добавлено {added} демонстрационных проектов.")
    else:
        print("База уже содержит проекты — сидирование пропущено.")


if __name__ == "__main__":
    main()
