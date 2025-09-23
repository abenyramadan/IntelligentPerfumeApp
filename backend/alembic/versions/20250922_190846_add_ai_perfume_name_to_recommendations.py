"""add_ai_perfume_name_to_recommendations

Revision ID: $(date +%Y%m%d_%H%M%S)_add_ai_perfume_name
Revises: c5b23461c31d
Create Date: $(date)

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '$(date +%Y%m%d_%H%M%S)_add_ai_perfume_name'
down_revision = 'c5b23461c31d'
branch_labels = None
depends_on = None


def upgrade():
    """Add ai_perfume_name column to recommendations table"""
    op.add_column('recommendations', sa.Column('ai_perfume_name', sa.String(255), nullable=True))


def downgrade():
    """Remove ai_perfume_name column from recommendations table"""
    op.drop_column('recommendations', 'ai_perfume_name')
