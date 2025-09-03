from sentence_transformers import SentenceTransformer, util

class VectorReranker:
    def __init__(self, model_name="all-MiniLM-L6-v2", threshold=0.5):
        self.model = SentenceTransformer(model_name)
        self.threshold = threshold

    def rerank(self, query, context):

        if not context:
            return []

        # Encode query and paper texts
        query_embedding = self.model.encode(query, convert_to_tensor=True)
        doc_texts = [f"{p['name']} {p['desc']}" for p in context]
        doc_embeddings = self.model.encode(doc_texts, convert_to_tensor=True)

        # Compute cosine similarity
        similarities = util.cos_sim(query_embedding, doc_embeddings)[0].cpu().tolist()

        results = []
        for domain, score in zip(context, similarities):
            # if score >= self.threshold:  # keep only relevant ones
            results.append({"name": domain["name"], "score": score})
                

        # sort by score
        results.sort(key=lambda x: x["score"], reverse=True)
        return results
    


        # # Attach score and rerank
        # scored = [
        #     {**paper, "score": float(similarity)}
        #     for paper, similarity in zip(papers, similarities)
        # ]
        # scored.sort(key=lambda x: x["score"], reverse=True)

        # return scored[:top_k] if top_k else scored
