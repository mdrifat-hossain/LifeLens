from .chaldal import Chaldal
from .meena_bazar import MeenaBazar
from .unimart import Unimart
import asyncio

async def fetch_all(query):
    sources = [
        Chaldal(),
        MeenaBazar(),
        Unimart()
    ]

    all_results = []

    async with asyncio.TaskGroup() as tg:
        results = {}

        for source in sources:
            async def safe_fetch(source):
                try:
                    result = await source.fetch(query)
                    results[source.__class__.__name__] = result
                except Exception as e:
                    print(f"⚠️ Error fetching from {source.__class__.__name__}:", e)
                    results[source.__class__.__name__] = []

            tg.create_task(safe_fetch(source))

    # After TaskGroup exits, everything is completed
    for res_list in results.values():
        all_results.extend(res_list)

    return all_results